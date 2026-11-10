(function () {
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    var timer;

    function show(text) {
        toast.textContent = text;
        toast.classList.add("is-visible");
        clearTimeout(timer);
        timer = setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 3500);
    }

    function fallbackCopy(text) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        var ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(area);
        return ok ? Promise.resolve() : Promise.reject();
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(function () {
                return fallbackCopy(text);
            });
        }
        return fallbackCopy(text);
    }

    document.addEventListener("click", function (event) {
        var link = event.target.closest('a[href^="mailto:"]');
        if (!link) {
            return;
        }
        var address = decodeURIComponent(link.getAttribute("href").slice(7).split("?")[0]);
        copy(address).then(function () {
            show("Indirizzo copiato: " + address);
        }, function () {
            show("Scrivici a " + address);
        });
    });
})();
