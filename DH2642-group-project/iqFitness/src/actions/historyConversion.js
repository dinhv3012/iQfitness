function historyEncoder(history) {
    // from [weight, reps] to {"weight": weight, "reps", reps}
    let convertedHistory = JSON.parse(JSON.stringify(history));

    Object.keys(convertedHistory).forEach((id) => {
        Object.keys(convertedHistory[id]).forEach((ex_name) => {
            Object.keys(convertedHistory[id][ex_name]).forEach((date) => {
                convertedHistory[id][ex_name][date] = convertedHistory[id][ex_name][date].reduce((a, e) => {
                    a.push({ "weight": e[0], "reps": e[1] });
                    return a;
                }, [])
            });
        });
    });
    return convertedHistory;
}

function historyDecoder(history) {
    // from {"weight": weight, "reps", reps} to [weight, reps]
    let convertedHistory = JSON.parse(JSON.stringify(history));

    Object.keys(convertedHistory).forEach((id) => {
        Object.keys(convertedHistory[id]).forEach((ex_name) => {
            Object.keys(convertedHistory[id][ex_name]).forEach((date) => {
                convertedHistory[id][ex_name][date] = convertedHistory[id][ex_name][date].reduce((a, e) => {
                    a.push([e["weight"], e["reps"]]);
                    return a;
                }, [])
            });
        });
    });
    return convertedHistory;
}

export { historyDecoder, historyEncoder }