export function formatScore(score, returnEmpty = false) {
    if (isNaN(score) || score === undefined || score == null || score === '') {
        return returnEmpty ? '' : '--';
    }
    score = parseFloat(score);
    return score.toFixed(0);
}

export function formatPercent(
    percent,
    fixed_point = 0,
    includeUnit = true,
    returnEmpty = false
) {
    if (
        percent === undefined ||
        percent == null ||
        percent === '' ||
        percent.toString().toLowerCase().includes('inf')
    )
        return returnEmpty ? '' : '--';
    percent = parseFloat(percent);
    const percentFixed = (percent * 100).toFixed(fixed_point);
    const formattedPercent =
        Math.abs(percentFixed) == 0 || Math.abs(percentFixed) == 0.0
            ? 0
            : percentFixed;

    if (includeUnit) {
        return formattedPercent + '%';
    }

    return formattedPercent;
}
export function formatDollars(dollars, fixed_point = 0, showCents = false) {
    if (dollars === undefined || dollars == null || isNaN(dollars)) return '--';
    dollars = parseFloat(dollars);

    // Regex to replace to add ',' every 3 characters.
    const dollarAmount = dollars.toFixed(fixed_point);
    var formatted = dollarAmount
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace('-', '');
    if (showCents == true && dollars !== 0) {
        if (formatted.includes('.')) {
            let split = formatted.split('.');
            split[1] = split[1].padEnd(2, '0');
            formatted = split.join('.');
        } else {
            formatted = formatted.concat('.00');
        }
    }
    if (parseFloat(dollarAmount) < 0) {
        return '-$' + formatted;
    } else {
        return '$' + formatted;
    }
}
export function formatDecimal(decimal, fixed_point = 1, returnEmpty = false) {
    if (decimal === undefined || decimal == null || isNaN(decimal))
        return returnEmpty ? '' : '--';
    decimal = parseFloat(decimal);
    return decimal.toFixed(fixed_point);
}

export function formatHours(hours, fixed_point = 0) {
    if (hours === undefined || hours == null || isNaN(hours)) return '--';
    hours = parseFloat(hours);
    const truncatedHours = hours.toFixed(fixed_point);
    return truncatedHours + (truncatedHours == 1 ? ' HR' : ' HRS');
}

export function formatDate(date, addOffset = false) {
    const fullDate = new Date(date);

    const m = fullDate.getMonth() + 1;
    const d = fullDate.getDate();
    const y = fullDate.getFullYear().toString().substring(2);

    return (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;
}

export function formatHoursToBusinessDays(
    hours,
    fixed_point = 0,
    includeUnit = true,
    returnEmpty = false
) {
    if (hours === undefined || hours == null || isNaN(hours))
        return returnEmpty ? '' : '--';
    hours = parseFloat(hours);
    // business hours are 7am-5pm CT
    const businessHours = 10;
    const businessDays = (hours / businessHours).toFixed(fixed_point);

    if (includeUnit) {
        return businessDays + (businessDays == 1 ? ' Day' : ' Days');
    }

    return businessDays;
}

export function formatAggregationWeek(startDate) {
    const firstDay = new Date(startDate);
    const lastDay = new Date(
        firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 6)
    );
    return formatDate(startDate, true) + ' - ' + formatDate(lastDay, true);
}

export function formatOTD(minutesDelayed, returnEmpty = false) {
    if (
        minutesDelayed === undefined ||
        minutesDelayed == null ||
        isNaN(minutesDelayed)
    )
        return returnEmpty ? '' : '--';
    return minutesDelayed;
}

export function formatName(name) {
    const whitelistWords = [
        'LLC',
        'XPO',
        'NFI',
        'FMI',
        'NAPA',
        'C.L.',
        'MET',
        'ICS',
        'MLG',
        'ECM',
        'RXO',
        'KBX',
        'RBX',
        'J.B.'
    ];
    const nameArray = name.split(' ');
    var formattedName = [];
    nameArray.forEach((word) => {
        if (word.length <= 2 || whitelistWords.includes(word)) {
            formattedName.push(word);
        } else if (word == 'WAL-MART') {
            formattedName.push('Wal-Mart');
        } else {
            const firstLetter = word[0];
            if (firstLetter == '(') {
                if (whitelistWords.includes(word.substring(1))) {
                    formattedName.push(word);
                } else {
                    formattedName.push(
                        word[0] +
                            word[1].toUpperCase() +
                            word.substring(2).toLowerCase()
                    );
                }
            } else {
                formattedName.push(
                    word[0].toUpperCase() + word.substring(1).toLowerCase()
                );
            }
        }
    });
    return formattedName.join(' ');
}

export function formatNumber(number, fixed_point = 0) {
    if (number === undefined || number == null || isNaN(number)) return '--';
    const numberAmount = parseFloat(number).toFixed(fixed_point);
    return Math.abs(numberAmount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
