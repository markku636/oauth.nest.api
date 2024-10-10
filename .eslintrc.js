module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  'no-var': 'error', // 要求使用 let 或 const 而不是 var
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
      ignoreReadBeforeAssign: false,
    },
  ],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  quotes: [1, 'single'], // 引號類型 `` "" ''

  semi: ['off', 'always'], // 語句強制分號結尾
  'semi-spacing': [0, { before: false, after: true }], // 分號前後空格
  'newline-after-var': 2, // 變量聲明後是否需要空一行
  'getter-return': ['error', { allowImplicit: true }], // 強制 getter 函數中出現 return 語句
  'no-control-regex': 'error', // 禁止在正則表達式中出現控制字元
  'no-dupe-args': 'error', // 禁止在函數定義或表達中出現重名參數
  'no-dupe-keys': 'error', // 禁止對象字面量中出現重復的 key
  'no-duplicate-case': 'error', // 禁止出現重復的 case 標簽
  'no-empty': 'error', // 禁止出現空語句塊
  'no-empty-character-class': 'error', // 禁止在正則表達式中使用空字元集
  'no-ex-assign': 'error', // 禁止對 catch 子句中的異常重新賦值
  'no-extra-semi': 'error', // 禁用不必要的分號
  'no-func-assign': 'error', // 禁止對 function 聲明重新賦值
  'no-inner-declarations': 'error', // 要求函數聲明和變量聲明（可選的）在程式或函數體的頂部
  'no-irregular-whitespace': 'error', // 禁止不規則的空白
  'no-obj-calls': 'error', // 禁止將 Math、JSON 和 Reflect 對象當作函數進行調用
  'no-unsafe-negation': 'error', // 禁止對關系運算符的左操作數使用否定操作符
  'require-atomic-updates': 'error', // 禁止由於 await 或 yield的使用而可能導致出現競態條件的賦值
  'use-isnan': 'error', // 禁止與 ‘NaN’ 的比較
  'valid-typeof': ['error', { requireStringLiterals: true }], // 強制 typeof 表達式與有效的字元串進行比較
  'block-scoped-var': 'error', // 強制把變量的使用限制在其定義的作用域範圍內
  curly: 'error', // 強制所有控制語句使用一致的括號風格
  // "default-case": "error", // 要求 switch 語句中有 default 分支
  'dot-location': ['error', 'property'], // 強制要求點操作符和屬性放在同一行
  'dot-notation': ['error'], // 強制盡可能地使用點號
  eqeqeq: ['error', 'always'], // 要求使用 === 和 !==
  'max-classes-per-file': 'error', // 制每個文件只能包含一個特定數量的類，沒有更多
  'no-case-declarations': 'error', // 不允許在 case 子句中使用詞法聲明, 可以用大括號
  'no-else-return': 'error', // 禁止 if 語句中 return 語句之後有 else 塊
  'no-empty-function': 'error', // 禁止出現空函數
  'no-empty-pattern': 'error', // 禁止使用空解構模式
  'no-fallthrough': ['error', { commentPattern: 'break[\\s\\w]*omitted' }], // 禁止 case 語句落空, 如果結尾有註釋滿足break[\\s\\w]*omitted，則忽略
  'no-floating-decimal': 'error', // 禁止數字字面量中使用前導和末尾小數點
  'no-global-assign': 'error', // 禁止對原生對象或只讀的全局對象進行賦值
  'no-multi-spaces': ['error', { ignoreEOLComments: true }], // 禁止在邏輯表達式、條件表達式、聲明、數組元素、對象屬性、序列和函數參數周圍使用多個空格
  'no-octal': 'error', // 禁用八進制字面量
  'no-redeclare': 'error', // 禁止多次聲明同一變量
  'no-self-assign': 'error', // 禁止自我賦值
  'no-with': 'error', // 禁用 with 語句
  'require-await': 'error', // 禁止使用不帶 await 表達式的 async 函數
  'no-shadow-restricted-names': 'error', // 禁止將標識符定義為受限的名字
  'array-bracket-spacing': ['error', 'never'], // 禁止在數組括號頭和尾出現空格
  'block-spacing': 'error', // 禁止或強制在代碼塊中開括號前和閉括號後有空格
  'brace-style': 'error', // 強制在代碼塊中使用一致的大括號風格
  camelcase: 'warn', // 強制使用駱駝拼寫法命名約定
  'comma-dangle': 'off', // 要求使用拖尾逗號
  'comma-spacing': ['error', { before: false, after: true }], // 強制在逗號前後使用一致的空格(禁止在逗號前使用空格, 要求在逗號後使用一個或多個空格)
  // "indent": ["error", 4], // 縮進風格, 2空格
  'jsx-quotes': ['error', 'prefer-double'], // 強制所有不包含雙引號的 JSX 屬性值使用雙引號
  'key-spacing': ['error', { beforeColon: false }], // 禁止在對象字面量的鍵和冒號之間存在空格
  'keyword-spacing': ['error', { before: true }], // 要求在關鍵字之前至少有一個空格
  // "lines-between-class-members": ["error", "always"], // 要求類成員之間出現空行
  'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }], // 要求在方法鏈中, 允許在同一行成鏈的最大深度
  'no-lonely-if': 'error', // 禁止 if 語句作為唯一語句出現在 else 語句塊中
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // 強制最大連續空行數(1), 強制文件末尾的沒有連續空行數
  'no-whitespace-before-property': 'error', // 禁止屬性前有空白
  // "object-curly-newline": ["error", { multiline: true }], // 強制花括號內使用換行符的一致性, 如果在屬性內部或屬性之間有換行符，就要求有換行符
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    {
      blankLine: 'any',
      prev: ['const', 'let', 'var'],
      next: ['const', 'let', 'var'],
    },
  ], // 要求或禁止在語句間填充空行, 該配置要求變量聲明之後都有空行
  'space-infix-ops': 'error', // 要求操作符周圍有空格
  'spaced-comment': ['error', 'always'], // 強制在註釋中前後添加空格
  'arrow-spacing': 'error', // 強制箭頭函數的箭頭前後使用一致的空格
  'no-class-assign': 'error', // 禁止修改類聲明的變量
  'no-const-assign': 'error', // 禁止修改用const聲明的變量
  'no-dupe-class-members': 'error', // 禁止類成員中出現重復的名稱
  'no-duplicate-imports': 'error', // 禁止重復模塊導入
  'no-new-symbol': 'error', // 禁止 Symbolnew 操作符和 new 一起使用
  'require-yield': 'error', // 要求 generator 函數內有 yield
  'rest-spread-spacing': ['error', 'never'], // 擴展運算符及其表達式之間不允許有空格
};
