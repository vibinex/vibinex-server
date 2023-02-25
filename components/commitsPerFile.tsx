import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

const barData = [
    {
        "fileName": "main.js",
        "commits": 172,
    },
    {
        "fileName": "index.ts",
        "commits": 151,
    },
    {
        "fileName": "Heros.ts",
        "commits": 145,
    },
    {
        "fileName": "profile.ts ",
        "commits": 187,
    },
    {
        "fileName": "setting.ts",
        "commits": 165,
    },
    {
        "fileName": "login.ts",
        "commits": 116,
    }
]

const CommitsPerFile = () => {
    return (
            <div className='h-[35rem] w-[100%] m-auto border-2 my-5 p-2 pb-12 rounded-md border-blue-200'>
                <div className='ml-5 mt-5 mb-[-10px]'>
                <h3>Metric : File Contribution</h3>
                <h4 className='text-gray-500'>About : Used to find out the total number of commits in each file.</h4>
                </div>
            <ResponsiveBar
                data={barData}
                keys={[
                    'commits',
                ]}
                indexBy="fileName"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'commits'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Files',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of commits',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in file: " + e.indexValue }}
            />
            </div>
    )
}
export default CommitsPerFile;