import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

const barData = [
    {
        "country": "main.ts",
        "profile.ts": 172,
        "profile.tsColor": "hsl(20, 70%, 50%)",
    },
    {
        "country": "index.ts",
        "main.ts": 151,
        "main.tsColor": "hsl(193, 70%, 50%)",
    },
    {
        "country": "Heros.ts",
        "index.ts": 145,
        "index.tsColor": "hsl(39, 70%, 50%)"
    },
    {
        "country": "profile.ts ",
        "login.ts": 187,
        "login.tsColor": "hsl(163, 70%, 50%)",
    },
    {
        "country": "setting.ts",
        "profile.ts": 165,
        "profile.tsColor": "hsl(285, 70%, 50%)",
    },
    {
        "country": "login.ts",
        "main.ts": 116,
        "main.tsColor": "hsl(112, 70%, 50%)",
    }
]

const MyResponsiveRadar = () => {
    return (
        <div className='h-[50rem] w-[90%] m-auto'>
            <div className='border-2 mt-10 p-2 rounded-md border-blue-200 text-[20px]'>
            <h3> <span>Repo Name : </span>Repo Profile Overview</h3>
            <h1><span>Own by : </span>Vibinex</h1>
            </div>

            <div className='h-[35rem] w-[100%] m-auto border-2 mt-5 p-2 pb-12 rounded-md border-blue-200'>
                <div className='ml-5 mt-5 mb-[-10px]'>
                <h3>Metric : File Contribution</h3>
                <h4 className='text-gray-500'>About : Used to find out the total number of files used in repo. You can see language used, code chunk, and much more details of each file.</h4>
                </div>
            <ResponsiveBar
                data={barData}
                keys={[
                    'main.ts',
                    'login.ts',
                    'profile.ts',
                    'index.ts'
                ]}
                indexBy="country"
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
                    legend: 'Number of lines',
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
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            } 
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
            />
</div>
        </div>
    )
}
export default MyResponsiveRadar;