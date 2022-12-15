import { useEthers } from '@usedapp/core';
import * as echarts from 'echarts';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import InfoModal from '../components/InfoModal';
// import Toggle from '../components/Toggle';
import { getGraph } from '../config/api';
import graph from '../mocks/graph.json';

interface IAppProps {
    provider: ethers.providers.Web3Provider
}

interface NodeInfo {
    name: string;
    ens: string;
    symbol: string;
    symbolSize: number;
    x: number;
    y: number;
    value: number;
    category: number;
}

const ensMap = new Map<string, string>();

let option = {
    // title: {
    //     text: 'Les Miserables',
    //     subtext: 'Default layout',
    //     top: 'bottom',
    //     left: 'right'
    // },
    tooltip: {
        confine: true,
    },
    legend: [
        {
            data: [
                {
                    name: 'inactive_node',
                    icon: 'image:///svg/inactive_node.svg',
                },
                {
                    name: 'active_node',
                    icon: 'image:///svg/active_node.svg',
                },
                {
                    name: 'my_inactive_node',
                    icon: 'image:///svg/inactive_node_my.svg',
                },
                {
                    name: 'my_active_node',
                    icon: 'image:///svg/active_node_my.svg',
                },
            ],
            textStyle: {
                fontFamily: 'Roboto',
                fontSize: 20,
            },
            itemWidth: 32,
            itemHeight: 32,
            height: 32,
        }
    ],
    series: [
        {
            name: 'Loopss',
            type: 'graph',
            layout: 'none',
            data: [],
            links: [],
            categories: graph.categories,
            roam: true,
            cursor: 'pointer',
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            legendHoverLink: false,
            label: {
                show: true,
                position: 'bottom',
                formatter: function (params: any) {
                    return params.data.ens ? params.data.ens : (params.data.name.substring(0, 6) + '...' + params.data.name.substring(params.data.name.length - 4, params.data.name.length));
                },
                fontFamily: 'Roboto',
                padding: [2, 0.1]
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    if (params.dataType === 'node') {
                        return "AT: " + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3);
                    } else {
                        // @ts-ignore
                        return params.data.source + ' → ' + params.data.target + '<br />' + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3) + ' Loopss';
                    }
                },
            },
            edgeLabel: {
                fontSize: 20
            },
            lineStyle: {
                color: 'target',
                curveness: 0.3
            },
            emphasis: {
                focus: 'adjacency',
                itemStyle: {
                    shadowBlur: 10,
                },
                lineStyle: {
                    width: 10
                },
            },
            // center: [-87.93029, -6.8120565],
            zoom: 1,
        }
    ],
    animation: true,
    animationDuration: 1500,
    animationEasing: 'quinticInOut',
    animationEasingUpdate: 'quinticInOut',
    media: [
        {
            query: {
                maxWidth: 500
            },
            option: {
                legend: [
                    {
                        textStyle: {
                            fontFamily: 'Roboto',
                            fontSize: 14,
                        },
                        itemWidth: 16,
                        itemHeight: 16,
                        height: 16,
                    }
                ],
                series: [
                    {
                        tooltip: {
                            formatter: function (params: any) {
                                if (params.dataType === 'node') {
                                    return "AT: " + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3);
                                } else {
                                    // @ts-ignore
                                    return params.data.source + '<br /> → <br />' + params.data.target + '<br />Value: ' + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3) + ' Loopss';
                                }
                            },
                        },
                    }
                ]
            }
        },
        {
            query: {
                minWidth: 500
            },
            option: {
                legend: [
                    {
                        textStyle: {
                            fontFamily: 'Roboto',
                            fontSize: 20,
                        },
                        itemWidth: 32,
                        itemHeight: 32,
                        height: 32,
                    }
                ],
                series: [
                    {
                        tooltip: {
                            formatter: function (params: any) {
                                if (params.dataType === 'node') {
                                    return "AT: " + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3);
                                } else {
                                    // @ts-ignore
                                    return params.data.source + ' → ' + params.data.target + '<br />' + (+ethers.utils.formatEther(ethers.BigNumber.from(params.data.value))).toFixed(3) + ' Loopss';
                                }
                            },
                        },
                    }
                ]
            }
        }
    ]

};

let myCharts: echarts.ECharts;

export default function Graph(props: IAppProps) {

    const { account } = useEthers();

    const [showInfoModal, setShowInfoModal] = useState(false);

    // const [withEns, setWithEns] = useState(false);

    const renderChart = () => {
        const myChart = echarts.init(document.getElementById('graph')!);
        myChart.showLoading({
            text: 'loading',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.5)',
            zlevel: 0,

            // 字体大小。从 `v4.8.0` 开始支持。
            fontSize: 12,
            // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
            showSpinner: true,
            // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
            spinnerRadius: 10,
            // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
            lineWidth: 5,
            // 字体粗细。从 `v5.0.1` 开始支持。
            fontWeight: 'normal',
            // 字体风格。从 `v5.0.1` 开始支持。
            fontStyle: 'normal',
            // 字体系列。从 `v5.0.1` 开始支持。
            fontFamily: 'sans-serif'
        });
        getGraph(account).then(async (res) => {
            res.nodes.forEach((node: any) => {
                if (node.ens) {
                    node.label = {
                        show: true,
                        borderRadius: 4,
                        padding: 2,
                        borderWidth: 1,
                        borderColor: '#000',
                    }
                }
            });

            option.series[0].data = res.nodes;
            option.series[0].links = res.links;

            if (res.center && res.center.length > 0) {
                // @ts-ignore
                option.series[0].center = res.center;
                option.series[0].zoom = 10;
            }
            // @ts-ignore
            myChart.setOption(option);
            myCharts = myChart;

            myChart.hideLoading();
            window.addEventListener('resize', () => {
                setTimeout(function () {
                    myChart.resize();
                }, 200)
            });

            myChart.on('click', function (params) {
                if (params.dataType === 'node') {
                    // transfer token
                    if (account) {
                        setShowInfoModal(true);
                    }
                }
            });

        }).catch((err) => {
            console.log(err);
        });
    }

    const lookupAddress = async (nodes: NodeInfo[]) => {
        const nodesWithEns = [];
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            if (ensMap.has(node.name)) {
                node.ens = ensMap.get(node.name)!;
            } else {
                await props.provider.lookupAddress(node.name).then((name: any) => {
                    if (name) {
                        node.ens = name;
                        ensMap.set(node.name, node.ens);
                    }
                }).catch((error: any) => {
                    console.log(error);
                });
            }
            nodesWithEns.push(node);
        }

        return nodesWithEns;
    }

    const changeInfoModal = () => {
        setShowInfoModal(!showInfoModal);
    };

    useEffect(() => {
        renderChart();
    }, [account]);

    return (
        <>
            {/* <div className='flex justify-start items-center space-x-2 md:space-x-4'>
                <span>ENS:&nbsp;</span>
                <Toggle toggled={isToggled} />
            </div> */}
            <div id="graph" className='absolute overflow-hidden left-0 mt-4 w-full h-[87vh]'></div>
            <InfoModal showModal={showInfoModal} changeInfoModal={changeInfoModal} />
        </>
    );
}
