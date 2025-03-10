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

import path from "path";

// 루트 경로를 설정합니다. (예: __dirname을 사용하여 현재 디렉토리)
// __dirname 대신 import.meta.url을 사용하여 현재 디렉토리 경로를 구함
const rootDir = path.dirname(new URL(import.meta.url).pathname);

// 폴더 안에 파일이 없는지 확인하고, 파일을 생성하는 함수
function checkAndCreateFileInEmptyFolder(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`폴더 읽기 실패: ${dir}`);
      return;
    }

    // 폴더가 비어있는 경우 파일 생성
    if (files.length === 0) {
      const newFilePath = path.join(dir, "김지인.md"); // 기본 파일 이름을 설정
      fs.writeFile(
        newFilePath,
        "이 파일은 폴더가 비어있을 때 자동으로 생성된 파일입니다.",
        (err) => {
          if (err) {
            console.error(`파일 생성 실패: ${newFilePath}`);
          } else {
            console.log(`파일 생성됨: ${newFilePath}`);
          }
        }
      );
    }
  });
}

// 루트 경로의 폴더들 순회
fs.readdir(rootDir, (err, items) => {
  if (err) {
    console.error("디렉토리 읽기 실패");
    return;
  }

  // 폴더만 필터링하여 순회
  items.forEach((item) => {
    const fullPath = path.join(rootDir, item);
    fs.stat(fullPath, (err, stat) => {
      if (err) {
        console.error(`파일 상태 확인 실패: ${fullPath}`);
        return;
      }

      if (stat.isDirectory()) {
        checkAndCreateFileInEmptyFolder(fullPath); // 폴더인 경우 확인 후 파일 생성
      }
    });
  });
});
