import React from "react";
import { useModalStore } from "src/store/modal/store";

function TestModal() {
  const { addModal } = useModalStore();
  return (
    <div>
      <button
        onClick={() => {
          addModal({
            title: "하하",
            element: <div>하위 모달</div>,
            isOpen: true,
          });
        }}
      >
        하위
      </button>
    </div>
  );
}

export default TestModal;
