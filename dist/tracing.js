"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const context_async_hooks_1 = require("@opentelemetry/context-async-hooks");
const core_1 = require("@opentelemetry/core");
const exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const propagator_b3_1 = require("@opentelemetry/propagator-b3");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const process = require("process");
const metricReader = new exporter_prometheus_1.PrometheusExporter({
    port: 8081,
});
const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
    url: 'http://otel-collector:4318/v1/traces',
});
const spanProcessor = new sdk_trace_base_1.BatchSpanProcessor(traceExporter);
const otelSDK = new sdk_node_1.NodeSDK({
    metricReader,
    spanProcessor: spanProcessor,
    contextManager: new context_async_hooks_1.AsyncLocalStorageContextManager(),
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
    textMapPropagator: new core_1.CompositePropagator({
        propagators: [
            new core_1.W3CTraceContextPropagator(),
            new core_1.W3CBaggagePropagator(),
            new propagator_b3_1.B3Propagator(),
            new propagator_b3_1.B3Propagator({
                injectEncoding: propagator_b3_1.B3InjectEncoding.MULTI_HEADER,
            }),
        ]
    })
});
exports.default = otelSDK;
process.on('SIGTERM', () => {
    otelSDK
        .shutdown()
        .then(() => console.log('SDK shut down successfully'), (err) => console.log('Error shutting down SDK', err))
        .finally(() => process.exit(0));
});
//# sourceMappingURL=tracing.js.map