import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Next 16 / eslint-config-next 16에서 새로 강화된 React Compiler 계열 룰.
      // 강의 코드(effect 안에서 setState 호출 등)를 그대로 보존하기 위해 완화한다.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default eslintConfig
