document.addEventListener('DOMContentLoaded', () => {
    const rocYearSelect = document.getElementById('rocYear');
    const stockForm = document.getElementById('stockForm');
    const stockCodeInput = document.getElementById('stockCode');
    const resultDiv = document.getElementById('result');
    const displayStockCode = document.getElementById('displayStockCode');
    const displayStockName = document.getElementById('displayStockName');
    const resultLink = document.getElementById('resultLink');

    // 填充民國年份下拉選單
    function populateRocYears() {
        const currentYear = new Date().getFullYear();
        const currentRocYear = currentYear - 1911;

        for (let year = currentRocYear; year >= 70; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `民國 ${year} 年`;
            rocYearSelect.appendChild(option);
        }
    }

    // 獲取股票名稱的非同步函數
    async function getStockName(stockCode) {
        // 使用 OTC 網站的上市公司基本資料
        // 注意：前端直接請求可能會遇到 CORS 問題
        const url = 'https://www.tpex.org.tw/web/stock/decisions/company/company_extract.php';
        // 發送 POST 請求，因為該 API 期望 POST
        const formData = new FormData();
        formData.append('op', 'find'); // 查詢操作
        formData.append('code', stockCode); // 股票代碼

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 根據實際 API 需求調整
                // }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // 檢查 data 是否包含 result 陣列，並且第一個元素是我們需要的資料
            if (data && data.aaData && data.aaData.length > 0) {
                // aaData[0][0] 通常是代碼，aaData[0][1] 是名稱
                const foundStockCode = data.aaData[0][0];
                const stockName = data.aaData[0][1];
                // 簡易檢查，確保抓到的代碼與輸入的相符
                if (foundStockCode === stockCode) {
                    return stockName;
                }
            }
            return '未知股票名稱'; // 如果沒有找到或格式不符
        } catch (error) {
            console.error('Error fetching stock name:', error);
            return '無法取得股票名稱'; // 發生錯誤時的處理
        }
    }

    populateRocYears();

    // 表單提交事件處理
    stockForm.addEventListener('submit', async (event) => { // 注意這裡加上 async
        event.preventDefault();

        const selectedRocYear = rocYearSelect.value;
        const stockCode = stockCodeInput.value.trim();

        if (selectedRocYear && stockCode) {
            // 顯示載入狀態或清空舊結果
            displayStockCode.textContent = stockCode;
            displayStockName.textContent = '載入中...';
            resultLink.textContent = '';
            resultDiv.style.display = 'block';

            // 獲取股票名稱
            const stockName = await getStockName(stockCode);
            displayStockName.textContent = stockName;

            const baseUrl = 'https://doc.twse.com.tw/server-java/t57sb01';
            const params = new URLSearchParams({
                step: 1,
                colorchg: 1,
                year: selectedRocYear,
                mtype: 'F',
                dtype: 'F01',
                co_id: stockCode
            });
            const fullUrl = `${baseUrl}?${params.toString()}`;

            resultLink.href = fullUrl;
            resultLink.textContent = '點擊查看詳細資料'; // 連結文字可以更簡潔
        } else {
            alert('請選擇民國年份並輸入股票代碼！');
            resultDiv.style.display = 'none';
        }
    });
});
