// shortener.js - 短链接生成模块

/**
 * 生成短链接
 * @param {string} longUrl - 需要缩短的长链接
 * @param {object} service - 服务配置对象，包含 name 和 apiUrl
 * @returns {Promise<string>} 返回短链接字符串
 */
async function generateShortLink(longUrl, service) {
    // 将 {url} 替换为实际长链接（已编码）
    const apiUrl = service.apiUrl.replace('{url}', encodeURIComponent(longUrl));
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }
    const shortUrl = await response.text();
    // 简单校验返回结果是否为合法URL
    if (!shortUrl || !shortUrl.startsWith('http')) {
        throw new Error('返回的链接无效');
    }
    return shortUrl;
}