"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    __mkl_serv_intel_cpu_true: {
        find: /\x53\x48\x83\xEC\x20\x8B\x35[\s\S]{4}/sg,
        replace: "\x55\x48\x89\xE5\xB8\x01\x00\x00\x00\x5D\xC3"
    },
    __intel_fast_memset_or_memcpy_A: {
        find: /(\xFF{4}|\x90{4})\x56\xE8(?:\x6A|\x5A|\x4A|\x3A)\x00\x00\x00([\s\S]{2})/sg,
        replace: "{1}\x56\xE8\x0A\x00\x00\x00{2}"
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXhlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWdleGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0JBQWU7SUFDZCx5QkFBeUIsRUFBRTtRQUMxQixJQUFJLEVBQUUseUNBQXlDO1FBQy9DLE9BQU8sRUFBRSw4Q0FBOEM7S0FDdkQ7SUFDRCwrQkFBK0IsRUFBRTtRQUNoQyxJQUFJLEVBQUUsMkVBQTJFO1FBQ2pGLE9BQU8sRUFBRSxnQ0FBZ0M7S0FDekM7Q0FDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXHRfX21rbF9zZXJ2X2ludGVsX2NwdV90cnVlOiB7XG5cdFx0ZmluZDogL1xceDUzXFx4NDhcXHg4M1xceEVDXFx4MjBcXHg4QlxceDM1W1xcc1xcU117NH0vc2csXG5cdFx0cmVwbGFjZTogXCJcXHg1NVxceDQ4XFx4ODlcXHhFNVxceEI4XFx4MDFcXHgwMFxceDAwXFx4MDBcXHg1RFxceEMzXCJcblx0fSxcblx0X19pbnRlbF9mYXN0X21lbXNldF9vcl9tZW1jcHlfQToge1xuXHRcdGZpbmQ6IC8oXFx4RkZ7NH18XFx4OTB7NH0pXFx4NTZcXHhFOCg/OlxceDZBfFxceDVBfFxceDRBfFxceDNBKVxceDAwXFx4MDBcXHgwMChbXFxzXFxTXXsyfSkvc2csXG5cdFx0cmVwbGFjZTogXCJ7MX1cXHg1NlxceEU4XFx4MEFcXHgwMFxceDAwXFx4MDB7Mn1cIlxuXHR9XG59O1xuIl19