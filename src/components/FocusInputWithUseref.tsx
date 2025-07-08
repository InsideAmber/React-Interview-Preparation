import {useRef} from 'react'

const FocusInputWithUseref = () => {
  const inputRef = useRef<any>(false);

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Enter something..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default FocusInputWithUseref