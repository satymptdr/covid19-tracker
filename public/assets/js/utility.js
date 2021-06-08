function init() {
    for (var t = document.getElementsByTagName("img"), e = 0; e < t.length; e++) t[e].getAttribute("data-src") && t[e].setAttribute("src", t[e].getAttribute("data-src"))
}
$(document).ready(function() {
    table = $.fn.dataTable.isDataTable("#example") ? $("#example").DataTable() : $("#example").DataTable({
        dom: "Bfrtip",
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        fixedColumns: {
            leftColumns: 1
        },
        buttons: ["pageLength", "print"],
        lengthMenu: [
            [10, 15, 25, 50, 100, -1],
            ['10 rows', '15 rows', '25 rows', '50 rows', '100 rows', 'All']
        ],
        paging: !0,
        bSort: !1,
        info: !0,
        oLanguage: {
            sSearch: "Country: "
        }
    })
}), $(function() {
    setInterval(() => {
        var t = moment();
        $("#date").html(t.format("dddd") + " - " + t.format("DD MMMM, YYYY")), $("#time").html(t.format("hh:mm:ss A"))
    }, 100)
}), window.onload = init, "serviceWorker" in navigator && navigator.serviceWorker.register("../sw.js").then(() => {
    console.log("SW registered")
}).catch(t => {
    console.log("service worker error!"), console.log(t)
});