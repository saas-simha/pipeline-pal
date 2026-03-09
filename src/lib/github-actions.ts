import type { SourceConfig } from "@/components/pipeline/SourcePanel";
import type { TargetConfig } from "@/components/pipeline/TargetPanel";
import type { PipelineStep } from "@/components/pipeline/PipelineStepsPanel";

export function generateActionYaml(): string {
  return `name: "FTP Deploy Action"
description: "Uploads project files to cPanel using FTP via LFTP"

inputs:
  server:
    description: "FTP server address"
    required: true
  username:
    description: "FTP username"
    required: true
  password:
    description: "FTP password"
    required: true
  path:
    description: "Remote deployment path"
    required: true

runs:
  using: "composite"
  steps:
    - name: Install lftp
      run: |
        sudo apt-get update
        sudo apt-get install lftp -y
      shell: bash

    - name: Deploy files via FTP
      run: |
        lftp -c "
          set ssl:verify-certificate no;
          set ftp:ssl-allow yes;
          open -u \${{ inputs.username }},\${{ inputs.password }} \${{ inputs.server }};
          mirror -R \\
            --delete \\
            --parallel=5 \\
            --exclude-glob .git* \\
            --exclude .github \\
            ./ \${{ inputs.path }};
          bye
        "
      shell: bash`;
}

export function generateWorkflowYaml(
  source: SourceConfig,
  target: TargetConfig,
  steps: PipelineStep[]
): string {
  const buildSteps = steps
    .filter((s) => s.type !== "checkout" && s.type !== "deploy")
    .map((s) => `    - name: ${s.name}\n      run: ${s.command}`)
    .join("\n\n");

  const usesFtpAction =
    target.deployType === "FTP" ||
    target.deployType === "cPanel" ||
    target.deployType === "SFTP";

  const deployStep = usesFtpAction
    ? `    - name: Deploy using FTP Action
      uses: ./.github/actions/ftp-deploy
      with:
        server: \${{ secrets.AI_FTP_SERVER }}
        username: \${{ secrets.AI_FTP_USERNAME }}
        password: \${{ secrets.AI_FTP_PASSWORD }}
        path: \${{ secrets.AI_FTP_PATH }}`
    : `    - name: Deploy
      run: echo "Deploy to ${target.deployType} target"`;

  return `name: Deploy to ${target.domain}

on:
  push:
    branches:
      - ${source.branch}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      with:
        repository: ${source.repository}
        ref: ${source.branch}

${buildSteps ? buildSteps + "\n\n" : ""}${deployStep}`;
}

export interface GitHubSecretsMapping {
  key: string;
  label: string;
  targetField: keyof TargetConfig;
  masked: boolean;
}

export const ftpSecretsMapping: GitHubSecretsMapping[] = [
  { key: "AI_FTP_SERVER", label: "FTP Server", targetField: "server", masked: false },
  { key: "AI_FTP_USERNAME", label: "FTP Username", targetField: "username", masked: false },
  { key: "AI_FTP_PASSWORD", label: "FTP Password", targetField: "password", masked: true },
  { key: "AI_FTP_PATH", label: "FTP Path", targetField: "deployPath", masked: false },
];
