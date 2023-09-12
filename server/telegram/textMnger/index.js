const texts = {
    'choosing': {
        'fa':
            'لطفا زبان موردنظر خود را انتخاب کنید',
        'en':
            'Please choose your language'
    },
    'welcome': {
        'fa':
            '⏏️\n\n' + 'به ربات لاتاری خوش آمدید\n\n' +
            'جهت ثبت نام گزینه ثبت نام را انتخاب کنید🔽\n\n',
        'en':
            "👋 Hi, Welcome to 'lottery' bot. \n\n"+

            "✅ Use these Commands to interact with Bot. \n\n"+
            "💵 Deposit  /deposit.\n"+
            "📈 Statistics  /stats.\n"+
            "💰 Next Drawing  /nextDraw\n"+
            "💰 All Drawings  /allDraws\n"
    },
    'back': {
        'fa':
            '▶️  ' + 'برگشت',
        'en':
            '◀️  ' + 'back'
    },
    'start': {
        'fa':
            '↩️  ' + 'شروع دوباره',
        'en':
            '↩️  ' + 'start again'
    },
    'changeLang': {
        'fa':
            '🔁 زبان / language',
        'en':
            '🔁 زبان / language',
    },
    'help': {
        'fa':
            'برای دریافت راهنما به ادمین پیام دهید',
        'en':
            'to get help please send message to admin.',
    },
    'errorFiiled': {
        'fa':
            '⚠️\n\n' + 'ظرفیت سرورها تکمیل شده است، لطفا پس از چند ساعت مجددا تلاش کنید\n\n',
        'en':
            '⚠️\n\n' + 'our servers are filled, please try again after some hours \n'
    },
    'error': {
        'fa':
            '⚠️\n\n' + 'خطا، لطفا مجددا تلاش کنید\n\n' +
            'شروع دوباره /start.',
        'en':
            '⚠️\n\n' + 'error, please try again \n' +
            'use /start to subscribe again.'
    },
    'inputError': {
        'fa':
            '⚠️\n\n' + 'خطا در اطلاعات ورودی،\n لطفا اطلاعات خود را به درستی وارد کنید\n\n' +
            'شروع دوباره /start.',
        'en':
            '⚠️\n\n' + 'error on input data, please input your data currectly \n' +
            'use /start to subscribe again.'
    },
    'apiError': {
        'fa':
            '⚠️\n\n' + 'خطا در اتصال به سرور تلگرام، لطفا ایمیل خود را مجددا وارد کنید\n\n' +
            'شروع دوباره /start.',
        'en':
            '⚠️\n\n' + 'error on connecting to telegram server, please insert your email again \n' +
            'use /start to subscribe again.'
    },
    'signup': {
        'fa':
            'ثبت نام' + ' 🔽',
        'en':
            'signup' + ' 🔽'
    },
    'signuping': {
        'fa':
            'در حال ثبت نام' + ' 🔽',
        'en':
            'signuping' + ' 🔽'
    },
    'onSignup': {
        'fa':
            'ثبت نام' + ' 🔽',
        'en':
            'onSignup' + ' 🔽'
    },
    'inputName': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            '1️⃣ لطفا نام نام خانوادگی خود را وارد کنید ' + '\n\n',
        'en':
            '▶️ ' + 'signup \n\n' +
            '1️⃣ Please insert your name' + '\n\n'
    },
    'inputWalletAddress': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            '1️⃣ لطفا آدرس کیف پول خود را وارد کنید ' + '\n\n',
        'en':
            '▶️ ' + 'signup \n\n' +
            '1️⃣ Please insert your wallet address' + '\n\n'
    },
    'inputlotteryEmail': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            '2️⃣ لطفا ایمیل lottery خود را وارد کنید' + '\n' +
            '(اعداد به انگلیسی)' + '\n\n',
        'en':
            '▶️ ' + 'signup \n\n' +
            '2️⃣ Please insert your lottery email' + '\n\n'
    },
    'inputlotteryPassword': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            '2️⃣ لطفا رمز عبور lottery خود را وارد کنید' + '\n',
        'en':
            '▶️ ' + 'signup \n\n' +
            '2️⃣ Please insert your lottery pasword' + '\n\n'
    },
    'inputEmail': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            '3️⃣ لطفا ایمیل خود را وارد کنید' + '\n\n',
        'en':
            '▶️ ' + 'signup \n\n' +
            '3️⃣ Please insert your email' + '\n\n'
    },
    'inputLoad': {
        'fa':
            '◀️ ' + 'ثبت بار \n\n' +
            '1️⃣ لطفا بار خود را با فرمت زیر وارد کنید' + '\n\n' +
            ' عنوان بار' + '\n' +
            'نوع کامیون:' + '\n' +
            'مبدا (استان):' + '\n' +
            'مبدا (شهر):' + '\n' +
            'مقصد (استان):' + '\n' +
            'مقصد (شهر):' + '\n' +
            'کرایه:' + '\n' +
            'تناژ:' + '\n' +
            'تماس:' + '\n' +
            'سفارش دهنده:' + '\n' +
            'سایر(نوع بار/بسته بندی/...):' + '\n' +
            '\n',
        'en':
            '▶️ ' + 'add load \n\n' +
            '1️⃣ Please insert your load' + '\n\n'
    },
    'signedUp': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            'ثبت نام شما با موفقیت انجام شد. \n' +
            'اکنون جهت ثبت سیگنال دوباره تلاش کنید.',
        'en':
            '▶️ ' + 'signup \n\n' +
            'successfull signup'
    },
    'invalidTx': {
        'fa':
            '◀️ ' + 'ثبت نام \n\n' +
            'هش تراکنش نامعتبر است',
        'en':
            '▶️ ' + 'signup \n\n' +
            'transaction hash is not valid'
    },
    'checkSignupStatus': {
        'fa':
            '◀️ ' +
            'بررسی وضعیت کاربر',
        'en':
            '▶️ ' +
            'checkSignupStatus'
    },
    'discountCode': {
        'fa':
            'وارد کردن کد تخفیف',
        'en':
            'apply discount code'
    },
    onOpenOrder: {
        'fa':
            '⭐️ثبت سیگنال با یک کلیک⭐️',
        'en':
            '⭐️open order⭐️'
    },
    followOrder: {
        'fa':
            '👈دنبال کردن سیگنال👉',
        'en':
            '👉follow order👈'
    },
    signupFirst: {
        'fa':
            '🚫 لطفا ابتدا ثبت نام کنید',
        'en':
            '🚫 please signup first'
    },
    invalidSignal: {
        'fa':
            '🚫 سیگنال برای ثبت سفارش مورد تایید نیست',
        'en':
            '🚫 signal is not valid to open position'
    },
    error: {
        'fa':
            '🚫 خطا در اجرای عملیات',
        'en':
            '🚫 error on request'
    },
    lotteryAccountsError: {
        'fa':
            '🚫 خطا در حساب کاربری lottery',
        'en':
            '🚫 error on lottery accounts'
    },
}

module.exports.get = (msg, lang) => {
    lang = lang ? lang : 'en';
    const text = texts[msg][lang];

    return text;
}

module.exports.findCommand = (msg) => {
    const key = Object.keys(texts).find((cmd) => {
        return texts[cmd]['fa'] === msg || texts[cmd]['en'] === msg;
    })
    return key;
}