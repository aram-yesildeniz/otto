import Perfume from 'perfume.js';
import './rum-fid';
import { performanceBeaconTracker } from "./tracking";
/**
 * Registers PerformanceObserver to track configured metrics.
 * @type {Perfume}
 */
new Perfume({
    firstPaint: true,
    firstContentfulPaint: true,
    firstInputDelay: true,
    logPrefix: "[Q-PSR Metrics] ",
    logging: false,
    maxMeasureTime: 60000,
    analyticsTracker: performanceBeaconTracker,
});
