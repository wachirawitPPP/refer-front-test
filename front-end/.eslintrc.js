module.exports = {
  "extends": [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "prettier"
  ],
  "rules": {
    "jsx-a11y/alt-text": "off",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "@next/next/no-img-element": "off",
    "@next/next/no-page-custom-font": "off",
    "lines-around-comment": "off", // ปิดการใช้งาน
    "padding-line-between-statements": "off", // ปิดการใช้งาน
    "newline-before-return": "off", // ปิดการใช้งาน
    "import/newline-after-import": "off", // ปิดการใช้งาน
    "import/order": "off", // ปิดการใช้งาน
    "import/no-named-as-default-member": "off",
    "import/no-unresolved": "off"

  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/parsers": {},
    "import/resolver": {
      "typescript": {
        "project": "./jsconfig.json"
      }
    }
  },
  "overrides": []
};
