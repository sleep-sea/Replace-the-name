// gist.js - GitHub Gist 操作模块

/**
 * 通过 Gist ID 获取其内容（假设只有一个文件）
 * @param {string} gistId - Gist 的 ID
 * @returns {Promise<string>} 返回文件内容
 */
async function fetchGistContent(gistId) {
    const apiUrl = `https://api.github.com/gists/${gistId}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Gist 不存在或不可访问 (${response.status})`);
    }
    const data = await response.json();
    const files = data.files;
    const firstFile = Object.values(files)[0];
    if (!firstFile || !firstFile.content) {
        throw new Error('Gist 中没有找到内容');
    }
    return firstFile.content;
}

/**
 * 生成基于 Gist 的分享链接
 * @param {string} gistId - Gist ID
 * @returns {string} 完整分享链接（例如 https://yourdomain.com/?gist=abc123）
 */
function buildGistShareUrl(gistId) {
    const baseUrl = getBaseUrl();
    return `${baseUrl}?gist=${encodeURIComponent(gistId)}`;
}