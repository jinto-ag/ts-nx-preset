const types = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
];

module.exports = {
  extends: ['@commitlint/config-conventional'],

  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(
        [
          '^',
          '(?:(:[a-z0-9]{1,20}:\\s))?',
          '([a-z]{1,10})',
          '(?:\\(([a-z][-a-z0-9]{0,29})\\))?',
          ':\\s',
          '(.{1,72})',
          '$',
        ].join('')
      ),
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },

  rules: {
    // Conventional Commit structure
    'type-enum': [2, 'always', types], // restrict types :contentReference[oaicite:9]{index=9}
    'scope-empty': [0], // scopes optional
    'subject-empty': [2, 'never'], // require subject
    'subject-full-stop': [2, 'never', '.'], // no trailing period
    'scope-case': [2, 'always', 'kebab-case'], // e.g. ui-components :contentReference[oaicite:10]{index=10}
    'type-case': [2, 'always', 'lower-case'], // enforce lowercase :contentReference[oaicite:11]{index=11}
    'subject-case': [2, 'always', 'sentence-case'], // Capitalize first word :contentReference[oaicite:12]{index=12}

    // Length and whitespace
    'header-max-length': [2, 'always', 72], // ≤72 chars for terminals :contentReference[oaicite:13]{index=13}
    'header-trim': [2, 'always'], // no surrounding whitespace :contentReference[oaicite:14]{index=14}
    'body-leading-blank': [2, 'always'], // blank line before body :contentReference[oaicite:15]{index=15}
    'footer-leading-blank': [2, 'always'], // blank line before footer :contentReference[oaicite:16]{index=16}
    'body-max-line-length': [2, 'always', 100], // wrap at 100 chars
    'footer-max-line-length': [2, 'always', 100], // wrap at 100 chars
  },

  prompt: {
    settings: {
      enableMultipleScopes: true,
      scopeEnumSeparator: ',',
    },
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: '✨ A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: { description: '🐛 A bug fix', title: 'Bug Fixes', emoji: '🐛' },
          docs: {
            description: '📚 Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '💎 Non-code styling changes',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '📦 Refactoring code without features',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '🚀 Performance improvements',
            title: 'Performance',
            emoji: '🚀',
          },
          test: {
            description: '🚨 Add or correct tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '🛠 Build system or dependencies',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: '⚙️ CI config and scripts',
            title: 'CI',
            emoji: '⚙️',
          },
          chore: {
            description: '♻️ Other non-src/test changes',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '⏪ Revert a previous commit',
            title: 'Reverts',
            emoji: '⏪',
          },
        },
      },
      scope: { description: 'What scope(s) are affected?' },
      subject: { description: 'Write a short, imperative description' },
      body: { description: 'Provide a longer description of the change' },
      isBreaking: { description: 'Are there any breaking changes?' },
      breakingBody: { description: 'Describe the breaking changes in detail' },
      breaking: { description: 'Write a short breaking change description' },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: { description: 'Provide issue details if closing issues' },
      issues: { description: 'Add issue references (e.g. "fix #123")' },
    },
  },
};
