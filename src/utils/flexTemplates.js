// 朋友資訊卡片模板
export const generateFriendBubble = (friend) => ({
    type: 'bubble',
    hero: {
        type: 'image',
        size: 'full',
        aspectRatio: '1:1',
        aspectMode: 'cover',
        url: friend.profileImageName
            ? `${process.env.IMAGE_BASE_URL}/${friend.profileImageName}.jpg`
            : `${process.env.IMAGE_BASE_URL}/default.jpg`
    },
    body: {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'text',
                text: friend.name || '未命名',
                weight: 'bold',
                size: 'xl',
                wrap: true
            },
            {
                type: 'box',
                layout: 'vertical',
                margin: 'lg',
                spacing: 'sm',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: friend.description || '這個人很懶，沒有留下任何介紹',
                                wrap: true,
                                margin: 'none',
                                size: 'sm',
                                color: '#666666'
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'text',
                                text: '🎂 生日',
                                color: '#aaaaaa',
                                size: 'sm',
                                flex: 2
                            },
                            {
                                type: 'text',
                                text: friend.birthday ? new Date(friend.birthday).toLocaleDateString('zh-TW') : '未設定',
                                wrap: true,
                                color: '#666666',
                                size: 'sm',
                                flex: 5
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'text',
                                text: '🎯 興趣',
                                color: '#aaaaaa',
                                size: 'sm',
                                flex: 2
                            },
                            {
                                type: 'text',
                                text: friend.interests?.join('、') || '無',
                                wrap: true,
                                color: '#666666',
                                size: 'sm',
                                flex: 5
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'text',
                                text: '🗣️ 口頭禪',
                                color: '#aaaaaa',
                                size: 'sm',
                                flex: 2
                            },
                            {
                                type: 'text',
                                text: friend.catchphrases?.join('、') || '無',
                                wrap: true,
                                color: '#666666',
                                size: 'sm',
                                flex: 5
                            }
                        ]
                    }
                ]
            }
        ]
    },
    footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
            {
                type: 'button',
                style: 'link',
                height: 'sm',
                action: {
                    type: 'postback',
                    label: '新增興趣',
                    data: `action=add_interest&id=${friend._id}`,
                    displayText: `我想新增興趣`
                }
            },
            {
                type: 'button',
                style: 'link',
                height: 'sm',
                action: {
                    type: 'postback',
                    label: '新增口頭禪',
                    data: `action=add_catchphrase&id=${friend._id}`,
                    displayText: `我想新增口頭禪`
                }
            }
        ],
        flex: 0
    },
    styles: {
        footer: {
            separator: true
        }
    }
});

export const friendInfoCard = (friend) => generateFriendBubble(friend);

// 朋友列表輪播卡片
export const friendsListCarousel = (friends, page = 1, pageSize = 5) => {
    const totalPages = Math.ceil(friends.length / pageSize);
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedFriends = friends.slice(startIndex, startIndex + pageSize);

    const friendBubbles = paginatedFriends.map(friend => generateFriendBubble(friend));

    if (totalPages > 1) {
        const prevPage = Math.max(1, currentPage - 1);
        const nextPage = Math.min(totalPages, currentPage + 1);
        const paginationBubble = {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'button',
                        action: {
                            type: 'postback',
                            label: '⬅️ 上一頁',
                            data: `action=page&page=${prevPage}`,
                            displayText: `查看第 ${prevPage} 頁`
                        },
                        style: 'primary',
                        height: 'sm',
                        gravity: 'center'
                    },
                    {
                        type: 'text',
                        text: `${currentPage} / ${totalPages}`,
                        align: 'center',
                        gravity: 'center',
                        size: 'sm',
                        color: '#666666',
                        flex: 1
                    },
                    {
                        type: 'button',
                        action: {
                            type: 'postback',
                            label: '下一頁 ➡️',
                            data: `action=page&page=${nextPage}`,
                            displayText: `查看第 ${nextPage} 頁`
                        },
                        style: 'primary',
                        height: 'sm',
                        gravity: 'center'
                    }
                ],
            }
        };
        friendBubbles.push(paginationBubble);
    }

    return {
        type: 'flex',
        altText: `朋友列表 - 第 ${currentPage} 頁，共 ${totalPages} 頁`,
        contents: {
            type: 'carousel',
            contents: friendBubbles
        }
    };
};

const formatDate = (dateString) => {
    if (!dateString) return '未設定';

    try {
        const date = new Date(dateString);

        return isNaN(date.getTime())
            ? '日期格式錯誤'
            : date.toLocaleDateString('zh-TW');
    } catch (error) {
        console.error('日期格式化錯誤:', error);

        return '日期格式錯誤';
    }
};

// 生日倒數卡片
export const birthdayCountdownCard = (friends) => ({
    type: 'bubble',
    header: {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'text',
                text: '🎂 生日倒數',
                weight: 'bold',
                size: 'xl',
                align: 'center'
            }
        ]
    },
    body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: friends.map((friend) => ({
            type: 'box',
            layout: 'horizontal',
            contents: [
                {
                    type: 'text',
                    text: friend.name,
                    size: 'md',
                    flex: 2,
                    wrap: true
                },
                {
                    type: 'text',
                    text: formatDate(friend.birthday),
                    size: 'sm',
                    color: '#666666',
                    align: 'end',
                    flex: 0
                },
                {
                    type: 'text',
                    text: `還有 ${friend.daysUntil} 天`,
                    size: 'sm',
                    color: '#497ec9',
                    align: 'end',
                    flex: 2
                }
            ]
        }))
    },
    footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'text',
                text: `共 ${friends.length} 個即將到來的生日`,
                wrap: true,
                align: 'center',
                color: '#666666'
            }
        ]
    },
    styles: {
        header: {
            backgroundColor: '#f6e2b4'
        }
    }
});

// 錯誤訊息卡片
export const errorCard = (message) => ({
    type: 'bubble',
    body: {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'text',
                text: '❌ 發生錯誤',
                weight: 'bold',
                size: 'lg',
                margin: 'md'
            },
            {
                type: 'text',
                text: message,
                wrap: true,
                margin: 'md'
            }
        ]
    }
});

// 幫助卡片模板 - 朋友
const helpCardFriend = () => ({
    "type": "bubble",
    "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
            {
                "type": "text",
                "text": "👥 朋友相關指令",
                "weight": "bold",
                "size": "xl",
                "align": "center"
            },
            {
                "type": "separator",
                "margin": "lg"
            },
            {
                "type": "text",
                "text": "• 查看所有朋友",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：查看所有朋友",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• [名字] 查看這個朋友",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：小明 查看這個朋友",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• 隨機查看朋友",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：隨機查看朋友",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• [名字] 新增興趣 [興趣]",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：小明 新增興趣 睡覺",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• [名字] 新增口頭禪 [口頭禪]",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：小明 新增口頭禪 蛤",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            }
        ]
    }
});

// 幫助卡片模板 - 生日
const helpCardBirthday = () => ({
    "type": "bubble",
    "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
            {
                "type": "text",
                "text": "🎂 生日相關指令",
                "weight": "bold",
                "size": "xl",
                "align": "center"
            },
            {
                "type": "separator",
                "margin": "lg"
            },
            {
                "type": "text",
                "text": "• 今天生日的朋友",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：今天生日的朋友",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• 生日倒數",
                "size": "sm",
                "color": "#497ec9",
                "wrap": true,
                "weight": "bold"
            },
            {
                "type": "text",
                "text": "範例：生日倒數",
                "size": "sm",
                "color": "#999999",
                "wrap": true
            }
        ]
    }
});
 
// 幫助卡片模板 - 快速指令
const helpCardQuick = () => ({
    "type": "bubble",
    "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
            {
                "type": "text",
                "text": "📌 快速指令縮寫",
                "weight": "bold",
                "size": "xl",
                "align": "center"
            },
            {
                "type": "separator",
                "margin": "lg"
            },
            {
                "type": "text",
                "text": "• ls = 查看所有朋友",
                "size": "sm",
                "color": "#666666",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• r = 隨機查看朋友",
                "size": "sm",
                "color": "#666666",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• b = 今天生日的朋友",
                "size": "sm",
                "color": "#666666",
                "wrap": true
            },
            {
                "type": "text",
                "text": "• bc = 生日倒數",
                "size": "sm",
                "color": "#666666",
                "wrap": true
            }
        ]
    }
});

export const helpCard = () => {
    return {
        type: 'flex',
        altText: '使用說明',
        contents: {
            type: 'carousel',
            contents: [helpCardFriend(), helpCardBirthday(), helpCardQuick()]
        }
    };
};
