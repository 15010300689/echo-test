#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// TODO: 改成你自己的服务地址
const SERVER_BASE = 'https://dev.58v5.cn';
// TODO: 改成你自己的集群名或项目名
const CLUSTER_NAME = 'wuxian_fe_vidflow';
const PAGE_SIZE = 10;

async function main() {
  const { command, version } = parseArgs(process.argv.slice(2));

  switch (command) {
    case 'list':
      await printVersions();
      return;
    case 'download':
      requireVersion(version);
      await downloadPackage(version);
      return;
    case 'publish':
      requireVersion(version);
      await publishPackage(version);
      return;
    default:
      throw new Error(`未知命令: ${command}`);
  }
}

function parseArgs(argv) {
  if (argv.length < 1) {
    printUsageAndExit();
  }

  const command = argv[0];
  let version = '';

  for (let i = 1; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--version') {
      version = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--help' || token === '-h') {
      printUsageAndExit();
    }
    throw new Error(`未知参数: ${token}`);
  }

  return { command, version };
}

function printUsageAndExit() {
  console.log(`用法:
  node scripts/deploy.mjs list
  node scripts/deploy.mjs download --version <version>
  node scripts/deploy.mjs publish --version <version>`);
  process.exit(1);
}

function requireVersion(version) {
  if (!version) {
    throw new Error('缺少 --version 参数');
  }
}
function resolveVersionStatus(item) {
  return item?.dyncProps?.packageStatusShow || item?.statusText || item?.status || '-';
}
function isPublishableStatus(status) {
  return !/失败|fail|取消|cancel/i.test(String(status));
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, redirect: 'follow', });
  } catch (error) {
    throw new Error(`请求失败: ${formatError(error)}`);
  }

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function printVersions() {
  const responseText = await fetchJson(
    `${SERVER_BASE}/api/versions?clusterName=${encodeURIComponent(CLUSTER_NAME)}&filterMainBranch=false&pageSize=${encodeURIComponent(PAGE_SIZE)}&page=1`,
  );
  const data = parseJson(responseText, '版本列表接口返回了非法 JSON');
  const items = data?.data?.list || [];

  const result = items.map((item) => {
    const status = resolveVersionStatus(item);
    const creators = Array.isArray(item?.dyncProps?.creator) ? item.dyncProps.creator : [];

    return {
      id: item.id,
      version: item.version,
      status,
      publishable: isPublishableStatus(status),
      branchName: item.branchName || '-',
      creator: item.creator || creators[0]?.userName || '-',
      buildTime: item.liftTestTime || item.createTime || '-',
    };
  });

  console.log(JSON.stringify({ items: result }, null, 2));
}
function parseJson(input, errorMessage) {
  try {
    return JSON.parse(input);
  } catch {
    throw new Error(errorMessage);
  }
}

async function downloadPackage(version) {
  // TODO: 1) 调接口拿下载地址 2) 下载文件到本地
  // 这里先打印演示，后续按你项目对接
  console.log(
    JSON.stringify(
      {
        action: 'download',
        version,
        message: '这里替换为真实下载逻辑（比如下载 all.tar.gz）',
      },
      null,
      2,
    ),
  );
}

async function publishPackage(version) {
  // TODO: 改成你项目的发布脚本相对路径
  const publishScript = join(process.cwd(), 'bin', 'ok-build-k8s.sh');

  if (!existsSync(publishScript)) {
    throw new Error(`找不到发布脚本: ${publishScript}`);
  }

  const result = spawnSync('sh', [publishScript, version], { stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function formatError(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return '未知错误';
}

main().catch((error) => {
  console.error(formatError(error));
  process.exit(1);
});

