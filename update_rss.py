import feedparser

# 你想訂閱的 RSS 列表
rss_urls = [
    "https://news.yahoo.com.tw/rss/technology",
    # 也可以放入你之前自己用 GAS 或 PHP 產生的股東會紀念品 RSS 連結
]

html_content = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>我的個人 RSS 閱讀器</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .feed-item { background: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        a { color: #0066cc; text-decoration: none; font-size: 18px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>📰 我的個人 RSS 閱讀情報站</h1>
"""

for url in rss_urls:
    feed = feedparser.parse(url)
    for entry in feed.entries[:5]: # 每個來源只取前 5 則
        html_content += f"""
        <div class="feed-item">
            <a href="{entry.link}" target="_blank">{entry.title}</a>
            <p style="color:#666; font-size:14px;">來源：{feed.feed.title if 'title' in feed.feed else '未知'}</p>
        </div>
        """

html_content += "</body></html>"

with open("MeetingNotice.html", "w", encoding="utf-8") as f:
    f.write(html_content)
