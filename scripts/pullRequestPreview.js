import { execSync } from "child_process";
import fetch from "node-fetch";

console.log("[DEPLOY_PREVIEW]: START");
const command = "yarn deploy:staging";
const output = execSync(command, { encoding: "utf8" });
const outputLines = output.split("\n");
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log("[DEPLOY_PREVIEW]: END");

console.log(`You can see the deploy preview on: ${DEPLOY_URL}`);

// ===================================
// ===================================

console.log("[GITHUB_COMMENT]: START");
const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_PR_NUMBER } = process.env;
const GH_COMMENT = `
- Deploy URL: [${DEPLOY_URL}](${DEPLOY_URL})
`;

const defaultHeaders = {};
defaultHeaders["authorization"] = `token ${GITHUB_TOKEN}`;
defaultHeaders["accept"] =
  "application/vnd.github.v3+json; application/vnd.github.antiope-preview+json";
defaultHeaders["content-type"] = "application/json";

console.log("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);

fetch(
  `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
  {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: GH_COMMENT }),
  },
)
  .then((response) => {
    console.log(response);
    if (response.ok) {
      console.log("Comentário adicionado com sucesso ao pull request.");
    } else {
      console.error("Falha ao adicionar comentário ao pull request.");
    }
  })
  .catch((error) => console.error("Erro:", error));
