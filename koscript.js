document.addEventListener('DOMContentLoaded', () => {
    const rocYearSelect = document.getElementById('rocYear');
    const stockForm = document.getElementById('stockForm');
    const stockCodeInput = document.getElementById('stockCode');
    const resultDiv = document.getElementById('result');
    const resultLink = document.getElementById('resultLink');

    // 填充民國年份下拉選單
    function populateRocYears() {
        const currentYear = new Date().getFullYear(); // 獲取當前西元年份
        const currentRocYear = currentYear - 1911; // 轉換為民國年份

        // 從民國 70 年開始，可以根據需要調整起始年份
        for (let year = currentRocYear; year >= 70; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `民國 ${year} 年`;
            rocYearSelect.appendChild(option);
        }
    }

    populateRocYears();

    // 表單提交事件處理
    stockForm.addEventListener('submit', (event) => {
        event.preventDefault(); // 阻止表單預設提交行為

        const selectedRocYear = rocYearSelect.value;
        const stockCode = stockCodeInput.value.trim();

        if (selectedRocYear && stockCode) {
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
            resultLink.textContent = "開會通知單";
            resultDiv.style.display = 'block'; // 顯示結果區塊
        } else {
            alert('請選擇民國年份並輸入股票代碼！');
            resultDiv.style.display = 'none'; // 隱藏結果區塊
        }
    });
});
