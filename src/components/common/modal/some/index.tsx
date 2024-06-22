import PopupContent from "src/components/common/modeless/PopupContent";
import { useModalStore } from "src/store/modal/store";
import { openBrowserPopup } from "src/utils/open-browser-popup";

function TestModal() {
  const handleOpenPopup = () => {
    openBrowserPopup(<PopupContent />, "Popup", 600, 400);
  };
  return (
    <div>
      <button
        onClick={() => {
          handleOpenPopup();
        }}
      >
        하위
      </button>
    </div>
  );
}

export default TestModal;
