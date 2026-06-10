<template>
    <v-tooltip
        location="top"
        open-delay="1000"
        :disabled="true"
    >
        <template #activator="{ props }">
            <div
                id="draw-gauge"
                ref="gaugeRef"
                style="width: 100%; height: 16em"
                v-bind="props"
            />
        </template>

        <span>Score</span>
    </v-tooltip>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useTheme } from 'vuetify';
import * as Two from "two.js";

const props = defineProps({
    averageScore: {
        type: [String, Number],
        default: '--'
    },

    gaugeCardWidth: {
        type: Number,
        default: 0
    },

    browserZoom: {
        type: Number,
        default: 0
    }
});

const theme = useTheme();

const gaugeRef = ref(null);

const scoreAvg = ref('--');
const dialWidth = ref(0);
const zoom = ref(0);

const isDark = computed(() => theme.global.current.value.dark);

const getScoreText = (score) => {
    if (
        score == null ||
        isNaN(score) ||
        score === 'N/A' ||
        score === '--'
    ) {
        return 'Score not available';
    }

    const ranges = [
        { start: 0, end: 69, text: 'Your score is bad' },
        { start: 70, end: 79, text: 'Your score is fair' },
        { start: 80, end: 89, text: 'Your score is good' },
        { start: 90, end: 100, text: 'Your score is excellent' }
    ];

    let tempRangeText = '';

    ranges.forEach((range) => {
        if (score >= range.start && score <= range.end) {
            tempRangeText = range.text;
        }
    });

    return tempRangeText;
};

const clearGauge = () => {
    if (gaugeRef.value) {
        gaugeRef.value.innerHTML = '';
    }
};

const displayGauge = async () => {
    await nextTick();

    const elem = gaugeRef.value;

    if (!elem) {
        return;
    }

    const clientWidth = elem.clientWidth;
    const clientHeight = elem.clientHeight;

    const params = {
        width: clientWidth,
        height: clientHeight
    };

    const two = new Two(params).appendTo(elem);

    let score = parseFloat(scoreAvg.value).toFixed(0);

    const scoreTextValue = getScoreText(score);
    const scoreAdjustment = 55;

    let zoomlevel = zoom.value / 100;

    if (zoomlevel === 0 || zoomlevel > 1) {
        zoomlevel = 1;
    }

    let radius;

    if (0.85 * params.width <= params.height) {
        radius = 0.44 * params.width * zoomlevel;
    } else {
        radius = 0.54 * params.height * zoomlevel;
    }

    const drawArc = (start, end, color) => {
        const points = [];

        for (let degrees = start; degrees < end; degrees++) {
            const theta = (degrees * Math.PI) / 180;

            const x = radius * Math.cos(theta);
            const y = radius * Math.sin(theta);

            points.push(new Two.Anchor(-x, -y));
        }

        const path = two.makeCurve(points, true);

        path.noFill().linewidth = parseInt(radius * (10 / 130));
        path.cap = 'round';
        path.stroke = color;
    };

    const ranges = [
        {
            start: 0,
            end: 69,
            color: isDark.value
                ? 'rgba(242, 55, 86, 1)'
                : '#F23756'
        },
        {
            start: 70,
            end: 79,
            color: isDark.value
                ? 'rgba(255, 171, 108, 0.8)'
                : '#FFAB6C'
        },
        {
            start: 80,
            end: 89,
            color: isDark.value
                ? 'rgba(26, 171, 255, 0.75)'
                : '#1AABFF'
        },
        {
            start: 90,
            end: 100,
            color: isDark.value
                ? 'rgba(42, 192, 142, 0.75)'
                : '#2AC08E'
        }
    ];

    const startOffset = -35;
    const endAngle = 180 - startOffset;
    const total = endAngle - startOffset;

    let cursorColor;

    ranges.forEach((item) => {
        let start = item.start;

        if (start === 70 || start === 80 || start === 90) {
            start += 2;
        }

        let end = item.end;

        if (end === 69 || end === 79 || end === 89) {
            end += 2;
        }

        const startPct =
            start === 0
                ? start / (100 - scoreAdjustment)
                : (start - scoreAdjustment) /
                  (100 - scoreAdjustment);

        const endPct =
            (end - scoreAdjustment) /
            (100 - scoreAdjustment);

        drawArc(
            startPct * total + startOffset,
            item.end === 100 - scoreAdjustment || endPct === 1
                ? endPct * total + startOffset
                : endPct * total + startOffset - 3,
            item.color
        );
    });

    ranges.forEach((item) => {
        if (isNaN(score) || parseInt(score) === -1) {
            score = 'N/A';
        }

        if (
            score <= item.end &&
            score >= item.start
        ) {
            cursorColor = item.color;
        }
    });

    let scoreText;
    let scoreDescText;

    if (score >= 0) {
        scoreText = two.makeText(
            score.toString(),
            0,
            radius * (-25 / 130),
            {
                family: 'Roboto, sans-serif',
                size: radius * (60 / 130),
                leading: 50,
                weight: 300
            }
        );

        scoreText.fill = isDark.value
            ? '#D9D9D9'
            : 'black';

        scoreDescText = two.makeText(
            scoreTextValue,
            0,
            radius * (30 / 130),
            {
                family: 'Roboto, sans-serif',
                size: radius * (20 / 130),
                leading: 50,
                weight: 200
            }
        );

        const cursor = two.makeCircle(
            0,
            0,
            radius * (8 / 130)
        );

        cursor.fill = isDark.value
            ? '#E1E1E1'
            : 'white';

        cursor.stroke = cursorColor;

        cursor.linewidth = parseInt(
            radius * (6 / 130)
        );

        cursor.cap = cursor.join = 'round';

        let adjustedScore =
            score < scoreAdjustment
                ? scoreAdjustment
                : score;

        if (
            adjustedScore > scoreAdjustment &&
            adjustedScore < 100
        ) {
            adjustedScore *= 1.03;
        }

        let cursorDegrees =
            ((adjustedScore - scoreAdjustment) /
                (100 - scoreAdjustment)) *
                total +
            startOffset;

        const startScore = ranges.flatMap(
            (range) => range.start
        );

        if (
            !startScore.includes(adjustedScore) &&
            adjustedScore !== scoreAdjustment &&
            adjustedScore !== 100
        ) {
            cursorDegrees -= 3;
        }

        const cursorRadians =
            (cursorDegrees * Math.PI) / 180;

        const cursorX =
            radius * Math.cos(cursorRadians);

        const cursorY =
            radius * Math.sin(cursorRadians);

        cursor.translation.set(
            -cursorX,
            -cursorY
        );
    } else {
        scoreDescText = two.makeText(
            scoreTextValue,
            0,
            radius * (-10 / 130),
            {
                family: 'Roboto, sans-serif',
                size: radius * (20 / 130),
                leading: 50,
                weight: 300
            }
        );
    }

    scoreDescText.fill = isDark.value
        ? '#E1E1E1'
        : 'black';

    two.scene.translation.set(
        two.width / 2,
        two.height / 1.65
    );

    two.update();
};

const redrawGauge = async () => {
    clearGauge();
    await displayGauge();
};

watch(
    () => props.averageScore,
    async (val) => {
        scoreAvg.value = parseFloat(val);
        await redrawGauge();
    }
);

watch(
    () => props.gaugeCardWidth,
    async (val) => {
        dialWidth.value = val;
        await redrawGauge();
    }
);

watch(
    () => props.browserZoom,
    async (val) => {
        zoom.value = val;
        await redrawGauge();
    }
);

watch(
    isDark,
    async () => {
        await redrawGauge();
    }
);

onMounted(async () => {
    scoreAvg.value = parseFloat(props.averageScore);
    dialWidth.value = props.gaugeCardWidth;
    zoom.value = props.browserZoom;

    await displayGauge();
});
</script>

<style scoped>
.gauge-positioning {
    margin-top: -50px !important;
    margin-bottom: 15px !important;
}
</style>