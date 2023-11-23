module.exports = function formatTime(inputTime) {
    const time = new Date(`1970-01-01T${inputTime}Z`);
    const options = { timeZone: 'Asia/Jakarta', hour: 'numeric', minute: 'numeric' };
    return time.toLocaleTimeString('id-ID', options);
}