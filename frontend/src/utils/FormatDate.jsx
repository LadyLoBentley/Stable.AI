
function FormatDate(date) {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default FormatDate;