"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./src/utils/dataParser.ts":
/*!*********************************!*\
  !*** ./src/utils/dataParser.ts ***!
  \*********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   filterData: function() { return /* binding */ filterData; },\n/* harmony export */   getAggregatedDataByCountry: function() { return /* binding */ getAggregatedDataByCountry; },\n/* harmony export */   getCountryData: function() { return /* binding */ getCountryData; },\n/* harmony export */   getMinMaxValues: function() { return /* binding */ getMinMaxValues; },\n/* harmony export */   getUniqueBatteries: function() { return /* binding */ getUniqueBatteries; },\n/* harmony export */   getUniqueClimates: function() { return /* binding */ getUniqueClimates; },\n/* harmony export */   getUniqueContinents: function() { return /* binding */ getUniqueContinents; },\n/* harmony export */   getUniqueModelSeries: function() { return /* binding */ getUniqueModelSeries; },\n/* harmony export */   getUniqueVariables: function() { return /* binding */ getUniqueVariables; },\n/* harmony export */   parseData: function() { return /* binding */ parseData; }\n/* harmony export */ });\nfunction parseData(csvText) {\n    const lines = csvText.split(\"\\n\");\n    const header = lines[0].split(\";\");\n    const data = [];\n    // Skip header line and parse each data line\n    for(let i = 1; i < lines.length; i++){\n        const line = lines[i].trim();\n        if (!line) continue; // Skip empty lines\n        const values = line.split(\";\");\n        if (values.length !== header.length) continue; // Skip malformed lines\n        data.push({\n            battAlias: values[0],\n            country: values[1],\n            continent: values[2],\n            climate: values[3],\n            iso_a3: values[4],\n            model_series: values[5],\n            variable: values[6],\n            value: parseInt(values[7], 10),\n            description: values[8],\n            count: parseInt(values[9], 10)\n        });\n    }\n    return data;\n}\nfunction filterData(data, filters) {\n    return data.filter((item)=>{\n        // Apply each filter if it's set (not empty)\n        if (filters.variable && item.variable !== filters.variable) return false;\n        if (filters.continent && item.continent !== filters.continent) return false;\n        if (filters.climate && item.climate !== filters.climate) return false;\n        if (filters.battAlias && item.battAlias !== filters.battAlias) return false;\n        if (filters.modelSeries && item.model_series !== filters.modelSeries) return false;\n        return true;\n    });\n}\nfunction getCountryData(data, countryCode, filters) {\n    let filteredData = data.filter((item)=>item.iso_a3 === countryCode);\n    if (filters) {\n        filteredData = filterData(filteredData, filters);\n    }\n    return filteredData;\n}\nfunction getUniqueVariables(data) {\n    return [\n        ...new Set(data.map((item)=>item.variable))\n    ];\n}\nfunction getUniqueContinents(data) {\n    return [\n        ...new Set(data.map((item)=>item.continent).filter(Boolean))\n    ];\n}\nfunction getUniqueClimates(data) {\n    return [\n        ...new Set(data.map((item)=>item.climate).filter(Boolean))\n    ];\n}\nfunction getUniqueBatteries(data) {\n    return [\n        ...new Set(data.map((item)=>item.battAlias).filter(Boolean))\n    ];\n}\nfunction getUniqueModelSeries(data) {\n    return [\n        ...new Set(data.map((item)=>item.model_series).filter(Boolean))\n    ];\n}\nfunction getAggregatedDataByCountry(data, filters) {\n    const result = {};\n    // Apply filters first\n    const filteredData = filterData(data, filters);\n    filteredData.forEach((item)=>{\n        if (item.iso_a3) {\n            if (result[item.iso_a3]) {\n                result[item.iso_a3] += item.value;\n            } else {\n                result[item.iso_a3] = item.value;\n            }\n        }\n    });\n    return result;\n}\nfunction getMinMaxValues(data) {\n    const values = Object.values(data);\n    if (values.length === 0) return {\n        min: 0,\n        max: 0\n    };\n    return {\n        min: Math.min(...values),\n        max: Math.max(...values)\n    };\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPO1dBQUksSUFBSTJCLElBQUkzQixLQUFLNEIsR0FBRyxDQUFDUCxDQUFBQSxPQUFRQSxLQUFLZCxTQUFTLEVBQUVhLE1BQU0sQ0FBQ1U7S0FBVTtBQUN2RTtBQUVPLFNBQVNHLHFCQUFxQmpDLElBQWU7SUFDbEQsT0FBTztXQUFJLElBQUkyQixJQUFJM0IsS0FBSzRCLEdBQUcsQ0FBQ1AsQ0FBQUEsT0FBUUEsS0FBS1QsWUFBWSxFQUFFUSxNQUFNLENBQUNVO0tBQVU7QUFDMUU7QUFFTyxTQUFTSSwyQkFBMkJsQyxJQUFlLEVBQUVtQixPQUFzQjtJQUNoRixNQUFNZ0IsU0FBaUMsQ0FBQztJQUV4QyxzQkFBc0I7SUFDdEIsTUFBTVYsZUFBZVAsV0FBV2xCLE1BQU1tQjtJQUV0Q00sYUFBYVcsT0FBTyxDQUFDZixDQUFBQTtRQUNuQixJQUFJQSxLQUFLVixNQUFNLEVBQUU7WUFDZixJQUFJd0IsTUFBTSxDQUFDZCxLQUFLVixNQUFNLENBQUMsRUFBRTtnQkFDdkJ3QixNQUFNLENBQUNkLEtBQUtWLE1BQU0sQ0FBQyxJQUFJVSxLQUFLUCxLQUFLO1lBQ25DLE9BQU87Z0JBQ0xxQixNQUFNLENBQUNkLEtBQUtWLE1BQU0sQ0FBQyxHQUFHVSxLQUFLUCxLQUFLO1lBQ2xDO1FBQ0Y7SUFDRjtJQUVBLE9BQU9xQjtBQUNUO0FBRU8sU0FBU0UsZ0JBQWdCckMsSUFBNEI7SUFDMUQsTUFBTUssU0FBU2lDLE9BQU9qQyxNQUFNLENBQUNMO0lBQzdCLElBQUlLLE9BQU9ILE1BQU0sS0FBSyxHQUFHLE9BQU87UUFBRXFDLEtBQUs7UUFBR0MsS0FBSztJQUFFO0lBRWpELE9BQU87UUFDTEQsS0FBS0UsS0FBS0YsR0FBRyxJQUFJbEM7UUFDakJtQyxLQUFLQyxLQUFLRCxHQUFHLElBQUluQztJQUNuQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy91dGlscy9kYXRhUGFyc2VyLnRzPzE4ODkiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBLUElEYXRhIHtcbiAgYmF0dEFsaWFzOiBzdHJpbmc7XG4gIGNvdW50cnk6IHN0cmluZztcbiAgY29udGluZW50OiBzdHJpbmc7XG4gIGNsaW1hdGU6IHN0cmluZztcbiAgaXNvX2EzOiBzdHJpbmc7XG4gIG1vZGVsX3Nlcmllczogc3RyaW5nO1xuICB2YXJpYWJsZTogc3RyaW5nO1xuICB2YWx1ZTogbnVtYmVyO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBjb3VudDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlck9wdGlvbnMge1xuICB2YXJpYWJsZT86IHN0cmluZztcbiAgY29udGluZW50Pzogc3RyaW5nO1xuICBjbGltYXRlPzogc3RyaW5nO1xuICBiYXR0QWxpYXM/OiBzdHJpbmc7XG4gIG1vZGVsU2VyaWVzPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEYXRhKGNzdlRleHQ6IHN0cmluZyk6IEtQSURhdGFbXSB7XG4gIGNvbnN0IGxpbmVzID0gY3N2VGV4dC5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IGhlYWRlciA9IGxpbmVzWzBdLnNwbGl0KCc7Jyk7XG4gIFxuICBjb25zdCBkYXRhOiBLUElEYXRhW10gPSBbXTtcbiAgXG4gIC8vIFNraXAgaGVhZGVyIGxpbmUgYW5kIHBhcnNlIGVhY2ggZGF0YSBsaW5lXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBsaW5lID0gbGluZXNbaV0udHJpbSgpO1xuICAgIGlmICghbGluZSkgY29udGludWU7IC8vIFNraXAgZW1wdHkgbGluZXNcbiAgICBcbiAgICBjb25zdCB2YWx1ZXMgPSBsaW5lLnNwbGl0KCc7Jyk7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggIT09IGhlYWRlci5sZW5ndGgpIGNvbnRpbnVlOyAvLyBTa2lwIG1hbGZvcm1lZCBsaW5lc1xuICAgIFxuICAgIGRhdGEucHVzaCh7XG4gICAgICBiYXR0QWxpYXM6IHZhbHVlc1swXSxcbiAgICAgIGNvdW50cnk6IHZhbHVlc1sxXSxcbiAgICAgIGNvbnRpbmVudDogdmFsdWVzWzJdLFxuICAgICAgY2xpbWF0ZTogdmFsdWVzWzNdLFxuICAgICAgaXNvX2EzOiB2YWx1ZXNbNF0sXG4gICAgICBtb2RlbF9zZXJpZXM6IHZhbHVlc1s1XSxcbiAgICAgIHZhcmlhYmxlOiB2YWx1ZXNbNl0sXG4gICAgICB2YWx1ZTogcGFyc2VJbnQodmFsdWVzWzddLCAxMCksXG4gICAgICBkZXNjcmlwdGlvbjogdmFsdWVzWzhdLFxuICAgICAgY291bnQ6IHBhcnNlSW50KHZhbHVlc1s5XSwgMTApXG4gICAgfSk7XG4gIH1cbiAgXG4gIHJldHVybiBkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRGF0YShkYXRhOiBLUElEYXRhW10sIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMpOiBLUElEYXRhW10ge1xuICByZXR1cm4gZGF0YS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgLy8gQXBwbHkgZWFjaCBmaWx0ZXIgaWYgaXQncyBzZXQgKG5vdCBlbXB0eSlcbiAgICBpZiAoZmlsdGVycy52YXJpYWJsZSAmJiBpdGVtLnZhcmlhYmxlICE9PSBmaWx0ZXJzLnZhcmlhYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGZpbHRlcnMuY29udGluZW50ICYmIGl0ZW0uY29udGluZW50ICE9PSBmaWx0ZXJzLmNvbnRpbmVudCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChmaWx0ZXJzLmNsaW1hdGUgJiYgaXRlbS5jbGltYXRlICE9PSBmaWx0ZXJzLmNsaW1hdGUpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoZmlsdGVycy5iYXR0QWxpYXMgJiYgaXRlbS5iYXR0QWxpYXMgIT09IGZpbHRlcnMuYmF0dEFsaWFzKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGZpbHRlcnMubW9kZWxTZXJpZXMgJiYgaXRlbS5tb2RlbF9zZXJpZXMgIT09IGZpbHRlcnMubW9kZWxTZXJpZXMpIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3VudHJ5RGF0YShkYXRhOiBLUElEYXRhW10sIGNvdW50cnlDb2RlOiBzdHJpbmcsIGZpbHRlcnM/OiBGaWx0ZXJPcHRpb25zKTogS1BJRGF0YVtdIHtcbiAgbGV0IGZpbHRlcmVkRGF0YSA9IGRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pc29fYTMgPT09IGNvdW50cnlDb2RlKTtcbiAgXG4gIGlmIChmaWx0ZXJzKSB7XG4gICAgZmlsdGVyZWREYXRhID0gZmlsdGVyRGF0YShmaWx0ZXJlZERhdGEsIGZpbHRlcnMpO1xuICB9XG4gIFxuICByZXR1cm4gZmlsdGVyZWREYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VW5pcXVlVmFyaWFibGVzKGRhdGE6IEtQSURhdGFbXSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsuLi5uZXcgU2V0KGRhdGEubWFwKGl0ZW0gPT4gaXRlbS52YXJpYWJsZSkpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaXF1ZUNvbnRpbmVudHMoZGF0YTogS1BJRGF0YVtdKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLm5ldyBTZXQoZGF0YS5tYXAoaXRlbSA9PiBpdGVtLmNvbnRpbmVudCkuZmlsdGVyKEJvb2xlYW4pKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVDbGltYXRlcyhkYXRhOiBLUElEYXRhW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbLi4ubmV3IFNldChkYXRhLm1hcChpdGVtID0+IGl0ZW0uY2xpbWF0ZSkuZmlsdGVyKEJvb2xlYW4pKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVCYXR0ZXJpZXMoZGF0YTogS1BJRGF0YVtdKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLm5ldyBTZXQoZGF0YS5tYXAoaXRlbSA9PiBpdGVtLmJhdHRBbGlhcykuZmlsdGVyKEJvb2xlYW4pKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVNb2RlbFNlcmllcyhkYXRhOiBLUElEYXRhW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbLi4ubmV3IFNldChkYXRhLm1hcChpdGVtID0+IGl0ZW0ubW9kZWxfc2VyaWVzKS5maWx0ZXIoQm9vbGVhbikpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFnZ3JlZ2F0ZWREYXRhQnlDb3VudHJ5KGRhdGE6IEtQSURhdGFbXSwgZmlsdGVyczogRmlsdGVyT3B0aW9ucyk6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4ge1xuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgXG4gIC8vIEFwcGx5IGZpbHRlcnMgZmlyc3RcbiAgY29uc3QgZmlsdGVyZWREYXRhID0gZmlsdGVyRGF0YShkYXRhLCBmaWx0ZXJzKTtcbiAgXG4gIGZpbHRlcmVkRGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmIChpdGVtLmlzb19hMykge1xuICAgICAgaWYgKHJlc3VsdFtpdGVtLmlzb19hM10pIHtcbiAgICAgICAgcmVzdWx0W2l0ZW0uaXNvX2EzXSArPSBpdGVtLnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2l0ZW0uaXNvX2EzXSA9IGl0ZW0udmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaW5NYXhWYWx1ZXMoZGF0YTogUmVjb3JkPHN0cmluZywgbnVtYmVyPik6IHsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0ge1xuICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKGRhdGEpO1xuICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHsgbWluOiAwLCBtYXg6IDAgfTtcbiAgXG4gIHJldHVybiB7XG4gICAgbWluOiBNYXRoLm1pbiguLi52YWx1ZXMpLFxuICAgIG1heDogTWF0aC5tYXgoLi4udmFsdWVzKVxuICB9O1xufSAiXSwibmFtZXMiOlsicGFyc2VEYXRhIiwiY3N2VGV4dCIsImxpbmVzIiwic3BsaXQiLCJoZWFkZXIiLCJkYXRhIiwiaSIsImxlbmd0aCIsImxpbmUiLCJ0cmltIiwidmFsdWVzIiwicHVzaCIsImJhdHRBbGlhcyIsImNvdW50cnkiLCJjb250aW5lbnQiLCJjbGltYXRlIiwiaXNvX2EzIiwibW9kZWxfc2VyaWVzIiwidmFyaWFibGUiLCJ2YWx1ZSIsInBhcnNlSW50IiwiZGVzY3JpcHRpb24iLCJjb3VudCIsImZpbHRlckRhdGEiLCJmaWx0ZXJzIiwiZmlsdGVyIiwiaXRlbSIsIm1vZGVsU2VyaWVzIiwiZ2V0Q291bnRyeURhdGEiLCJjb3VudHJ5Q29kZSIsImZpbHRlcmVkRGF0YSIsImdldFVuaXF1ZVZhcmlhYmxlcyIsIlNldCIsIm1hcCIsImdldFVuaXF1ZUNvbnRpbmVudHMiLCJCb29sZWFuIiwiZ2V0VW5pcXVlQ2xpbWF0ZXMiLCJnZXRVbmlxdWVCYXR0ZXJpZXMiLCJnZXRVbmlxdWVNb2RlbFNlcmllcyIsImdldEFnZ3JlZ2F0ZWREYXRhQnlDb3VudHJ5IiwicmVzdWx0IiwiZm9yRWFjaCIsImdldE1pbk1heFZhbHVlcyIsIk9iamVjdCIsIm1pbiIsIm1heCIsIk1hdGgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/utils/dataParser.ts\n"));

/***/ })

});