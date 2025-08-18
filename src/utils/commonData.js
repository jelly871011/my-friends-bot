const friendData = {
    interests: '興趣',
    catchphrases: '口頭禪',
};

const commands = [
    '幫助',
    '查看所有朋友',
    '查看這個朋友',
    '查看隨機朋友',
    '新增興趣',
    '新增口頭禪',
    '今天生日的朋友',
    '生日倒數',
];

const COMMAND_ALIASES_HINT =
    '可以使用英文縮寫，例如：h=幫助, ls=查看所有朋友, v=查看這個朋友, r=查看隨機朋友, i=興趣, c=口頭禪' +
    'b=今天生日的朋友, bc=生日倒數';

const help = [
    {
        command: '查看所有朋友',
        description: '列出所有朋友的基本資訊',
        example: '查看所有朋友',
    },
    {
        command: '[名字] 查看這個朋友',
        description: '查看特定朋友的詳細資料',
        example: '小明 查看這個朋友',
    },
    {
        command: '查看隨機朋友',
        description: '隨機查看一位朋友的詳細資料',
        example: '查看隨機朋友',
    },
    {
        command: '[名字] 新增興趣 [興趣1, 興趣2, ...]',
        description: '為朋友新增興趣（多個興趣請用逗號分隔）',
        example: '小明 新增興趣 足球,羽球',
    },
    {
        command: '[名字] 新增口頭禪 [口頭禪1, 口頭禪2, ...]',
        description: '為朋友新增口頭禪（多個請用逗號分隔）',
        example: '小明 新增口頭禪 早安,晚安',
    },
    {
        command: '今天生日的朋友',
        description: '查看今天生日的朋友',
        example: '今天生日的朋友',
    },
    {
        command: '生日倒數',
        description: '查看生日倒數',
        example: '生日倒數',
    },
];

const noNameCommands = ['查看所有朋友', '查看隨機朋友', '今天生日的朋友', '生日倒數', '幫助'];

const commandAliases = {
    // 幫助指令
    help: '幫助',
    h: '幫助',
    '?': '幫助',

    // 查看所有朋友
    list: '查看所有朋友',
    ls: '查看所有朋友',
    all: '查看所有朋友',

    // 查看單一朋友
    view: '查看這個朋友',
    v: '查看這個朋友',
    show: '查看這個朋友',
    s: '查看這個朋友',

    // 查看隨機朋友
    random: '查看隨機朋友',
    r: '查看隨機朋友',

    // 興趣相關
    interest: '新增興趣',
    i: '新增興趣',
    hobby: '新增興趣',

    // 口頭禪相關
    catchphrase: '新增口頭禪',
    c: '新增口頭禪',
    phrase: '新增口頭禪',
    p: '新增口頭禪',

    // 生日相關
    birthday: '今天生日的朋友',
    b: '今天生日的朋友',
    bd: '今天生日的朋友',
    bdy: '今天生日的朋友',
    birthdayCountdown: '生日倒數',
    bc: '生日倒數',
};

export { friendData, commands, COMMAND_ALIASES_HINT, help, noNameCommands, commandAliases };
