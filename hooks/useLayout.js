import { useDispatch, useSelector } from "react-redux";
import { updateAuthLayout, resetAuthLayout } from "@/redux/slices/layoutSlice";

/** 
 * Senior Dev Hook: useLayout
 * Provides a clean interface for orchestrating global UI transitions.
 */
export const useLayout = () => {
  const dispatch = useDispatch();
  const authLayout = useSelector((state) => state.layout);

  return {
    authLayout,
    updateAuthLayout: (props) => dispatch(updateAuthLayout(props)),
    resetAuthLayout: () => dispatch(resetAuthLayout()),
  };
};
