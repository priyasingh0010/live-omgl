// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     webpack: (config) => {
//         config.externals.push({
//             "bufferutil": "bufferutil",
//             "utf-8-validate": "utf-8-validate",
//         });
//         return config;
//     },
// };

// export default  nextConfig;


// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "bufferutil": "bufferutil",
            "utf-8-validate": "utf-8-validate",
        });
        return config;
    },
    async headers() {
        return [
            {
                source: "/api/socket/io",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                ],
            },
        ];
    },
};

export default  nextConfig;
