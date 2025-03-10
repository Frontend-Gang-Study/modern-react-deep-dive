import { Octokit } from "@octokit/rest";
import fs from "fs-extra";

const octokit = new Octokit({
  auth: "", // GitHub Personal Access Token
});

const owner = "Frontend-Gang-Study"; // GitHub 레포지토리 소유자
const repo = "modern-react-deep-dive"; // GitHub 레포지토리 이름

// 이슈의 태그를 기반으로 폴더 생성
async function createFoldersFromIssues() {
  try {
    const labels = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo,
    });

    // 각 이슈의 라벨을 가져와서 폴더 생성
    labels.data.forEach((label) => {
      const labelName = label.name;

      // 폴더가 없으면 생성
      const folderPath = `./${labelName}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`폴더 생성: ${folderPath}`);
      }
    });
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

createFoldersFromIssues();
