import { resetAuthLayout, updateAuthLayout } from "@/redux/slices/layoutSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Senior Dev Hook: useLayout
 * Provides a clean interface for orchestrating global UI transitions.
 */
export const useLayout = () => {
  const dispatch = useDispatch();
  const authLayout = useSelector((state) => state.layout);

  const handleUpdateAuthLayout = useCallback(
    (props) => dispatch(updateAuthLayout(props)),
    [dispatch]
  );

  const handleResetAuthLayout = useCallback(
    () => dispatch(resetAuthLayout()),
    [dispatch]
  );

  return {
    authLayout,
    updateAuthLayout: handleUpdateAuthLayout,
    resetAuthLayout: handleResetAuthLayout,
  };
};
