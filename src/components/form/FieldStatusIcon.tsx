import Spinner from "../common/Spinner";
import Icon from "../Icon";
import type { DuplicateFieldState } from "../../types/registration.types";

interface FieldStatusIconProps {
  status: DuplicateFieldState;
}

export default function FieldStatusIcon({ status }: FieldStatusIconProps) {
  if (status.checking) {
    return <Spinner className="w-4 h-4 text-slate-400" />;
  }
  if (status.isDuplicate === true) {
    return <Icon name="close" className="w-4 h-4 text-red-500" />;
  }
  if (status.isDuplicate === false) {
    return <Icon name="check" className="w-4 h-4 text-brand-green" />;
  }
  return null;
}
