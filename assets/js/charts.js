(() => {
    if (!window.Chart) return;
    const S = window.Orynwave;
    const charts = [];
    const style = () => {
        const s = getComputedStyle(document.documentElement);
        return {
            text: s.getPropertyValue("--muted").trim(),
            grid: s.getPropertyValue("--border").trim(),
        };
    };
    document.querySelectorAll("canvas[data-chart]").forEach((canvas) => {
        const data = S.demoData[canvas.dataset.series];
        const type = canvas.dataset.chart;
        const colors = style();
        const chart = new Chart(canvas, {
            type,
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: data.label,
                        data: [...data.values],
                        borderColor:
                            type === "doughnut"
                                ? ["#542447", "#9565b8", "#bd9bd2", "#d8c8e3"]
                                : "#9565b8",
                        backgroundColor:
                            type === "doughnut"
                                ? ["#542447", "#9565b8", "#bd9bd2", "#d8c8e3"]
                                : type === "radar"
                                  ? "#9565b833"
                                  : "#9565b8",
                        borderWidth: type === "line" ? 2 : 1,
                        borderRadius: type === "bar" ? 5 : 0,
                        tension: 0.35,
                        pointRadius: type === "line" ? 3 : 2,
                        fill: type === "radar",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? false
                    : { duration: 450 },
                plugins: {
                    legend: {
                        display: type === "doughnut",
                        position: "bottom",
                        labels: {
                            color: colors.text,
                            boxWidth: 10,
                            padding: 18,
                            font: { family: "Plus Jakarta Sans", size: 13 },
                        },
                    },
                    tooltip: { rtl: document.documentElement.dir === "rtl" },
                },
                scales:
                    type === "doughnut"
                        ? {}
                        : type === "radar"
                          ? {
                                r: {
                                    min: 0,
                                    max: 100,
                                    ticks: { display: false },
                                    pointLabels: { color: colors.text, font: { size: 13 } },
                                    grid: { color: colors.grid },
                                    angleLines: { color: colors.grid },
                                },
                            }
                          : {
                                x: {
                                    grid: { display: false },
                                    ticks: { color: colors.text, font: { size: 13 } },
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: { color: colors.grid },
                                    ticks: { color: colors.text, font: { size: 13 }, precision: 0 },
                                },
                            },
            },
        });
        chart.$original = [...data.values];
        charts.push(chart);
        canvas
            .closest(".chart-card")
            .querySelector(".chart-range")
            ?.addEventListener("change", (e) => {
                chart.data.datasets[0].data = chart.$original.map((v) =>
                    e.target.value === "previous" ? Math.round(v * 0.84) : v,
                );
                chart.update();
            });
    });
    document.addEventListener("appearancechange", () => {
        const colors = style();
        charts.forEach((chart) => {
            const type = chart.config.type;
            chart.options.plugins.legend.labels.color = colors.text;
            chart.options.plugins.legend.rtl = document.documentElement.dir === "rtl";
            chart.options.plugins.tooltip.rtl = document.documentElement.dir === "rtl";
            if (type === "radar") {
                chart.options.scales.r.pointLabels.color = colors.text;
                chart.options.scales.r.grid.color = colors.grid;
                chart.options.scales.r.angleLines.color = colors.grid;
            } else if (type !== "doughnut") {
                for (const axis of ["x", "y"]) {
                    chart.options.scales[axis].ticks.color = colors.text;
                    chart.options.scales[axis].grid.color = colors.grid;
                }
            }
            chart.update("none");
        });
    });
    document.getElementById("apply-analytics")?.addEventListener("click", () => {
        const range = document.getElementById("analytics-range").value;
        if (!range) {
            S.toast("Choose a date range first.");
            return;
        }
        const factor = range === "nov" ? 1 : range === "oct" ? 0.9375 : 2.8;
        charts.forEach((chart) => {
            chart.data.datasets[0].data = chart.$original.map((v) =>
                chart.canvas.dataset.series === "attendance" ? v : Math.round(v * factor),
            );
            chart.update();
        });
        document.querySelector('[data-analytics-kpi="revenue"]').textContent =
            "$" + Math.round(12480 * factor).toLocaleString();
        document.querySelector('[data-analytics-kpi="enrollments"]').textContent = Math.round(
            36 * factor,
        );
        document.querySelector('[data-analytics-kpi="growth"]').textContent =
            range === "quarter" ? "+28%" : range === "oct" ? "+9%" : "+12%";
        S.toast("Sample analytics updated for the selected period.");
    });
})();
