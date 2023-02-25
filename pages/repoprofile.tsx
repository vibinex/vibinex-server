import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

const barData = [
    {
        "fileName": "main.ts",
        "commits": 172,
        "main.tsColor": "hsl(20, 70%, 50%)",
    },
    {
        "fileName": "index.ts",
        "commits": 151,
        "index.tsColor": "hsl(193, 70%, 50%)",
    },
    {
        "fileName": "Heros.ts",
        "commits": 145,
        "Heros.tsColor": "hsl(39, 70%, 50%)"
    },
    {
        "fileName": "profile.ts ",
        "commits": 187,
        "profile.tsColor": "hsl(163, 70%, 50%)",
    },
    {
        "fileName": "setting.ts",
        "commits": 165,
        "setting.tsColor": "hsl(285, 70%, 50%)",
    },
    {
        "fileName": "login.ts",
        "commits": 116,
        "login.tsColor": "hsl(112, 70%, 50%)",
    }
]

const MyResponsiveRadar = () => {
    return (
        <div className='h-[50rem] w-[90%] m-auto'>
            <div className='border-2 mt-10 p-2 rounded-md border-blue-200 text-[20px]'>
            <h3> <span>Repo Name : </span>Repo Profile Overview</h3>
            <h1><span>Owned by : </span>Vibinex</h1>
            </div>

            <div className='h-[35rem] w-[100%] m-auto border-2 mt-5 p-2 pb-12 rounded-md border-blue-200'>
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
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
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
                            id: 'profile.ts'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
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
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in fileName: " + e.indexValue }}
            />
            </div>
        </div>
    )
}
export default MyResponsiveRadar;