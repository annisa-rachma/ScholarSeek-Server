function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function formatTime(inputTime) {
    const time = new Date(`1970-01-01T${inputTime}Z`);
    const options = { timeZone: 'Asia/Jakarta', hour: 'numeric', minute: 'numeric' };
    return time.toLocaleTimeString('id-ID', options);
}

module.exports = {formatDate, formatTime}