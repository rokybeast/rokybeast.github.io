// Poly Highlighting
Prism.languages.poly = {
    'comment': [
        {
            pattern: /\/\/.*$/m,
            greedy: true
        },
        {
            pattern: /\/\*[\s\S]*?\*\//,
            greedy: true
        }
    ],

    'string': {
        pattern: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
    },

    'decorator': {
        pattern: /@\w+/,
        alias: 'function'
    },

    'modifier': {
        pattern: /!\w+/,
        alias: 'keyword'
    },

    'flag': {
        pattern: /__\w+/,
        alias: 'constant'
    },

    'keyword': [
        /\b(?:new|as|import|from|export|public|private|protected)\b/,
        /\b(?:int|float|string|bool|object|array|tuple|collection|type)\b/,
        /\b(?:if|else|elseif|match|when|try|catch|finally|throw|return|break|continue)\b/,
        /\b(?:function|method|async|await|threadTask)\b/,
        /\b(?:class|interface|fragment|inherits|takes|extends)\b/,
        /\b(?:loop|for|while|in)\b/,
        /\b(?:self|super|Option|Error|read|write)\b/,
        /\b(?:true|false)\b/
    ],

    'builtin': {
        pattern: /\b(?:toString|toInt|toChar|isBool|isString|isInt|sleep|continue|Raise)\b/,
        alias: 'function'
    },

    'namespace': {
        pattern: /\b(?:gui|internetService|apiCall)\b/,
        alias: 'class-name'
    },

    'function': {
        pattern: /\b\w+(?=\s*\()/,
        greedy: true
    },

    'class-name': {
        pattern: /\b[A-Z]\w*\b/,
        greedy: true
    },

    'number': [
        /\b\d+\.\d+\b/,
        /\b\d+\b/,
        /\b[ui]\d+\b/
    ],

    'operator': [
        /~>/, /\|>/, /:/,
        /[+\-*/%]?=/,
        /===?|!==?|[<>]=?/,
        /&&?|\|\|?|!/,
        /[+\-*/%]/,
        /->/,
        /\b(?:and|or|not)\b/
    ],

    'property-access': {
        pattern: /\.\w+/,
        inside: {
            'punctuation': /\./,
            'property': /\w+/
        }
    },

    'constant': [
        /\b[A-Z_][A-Z0-9_]*\b/,
        /\b(?:null|undefined|NaN|Infinity)\b/
    ],

    'punctuation': /[{}[\]();,.]/,
};