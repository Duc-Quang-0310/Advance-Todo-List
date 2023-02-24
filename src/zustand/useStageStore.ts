import create from "zustand";
import { Filter, FirestoreSchema, Stage } from "./type";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { toastError, toastSuccess } from "../helper/toast";

interface StageStore {
  allStage: Stage[];
  loading: boolean;
  createNewStage: (params: Stage, onSuccess?: () => void) => Promise<void>;
  getAllStage: (filter?: Filter) => Promise<void>;
  updateStage: (
    params: Partial<Stage>,
    onSuccess?: () => void,
    hiddenToast?: boolean
  ) => Promise<void>;
  deleteStage: (
    params: Pick<Stage, "id">,
    onSuccess?: () => void
  ) => Promise<void>;
  setStageStore: (params: Partial<StageStore>) => void;
}

const useStageStore = create<StageStore>()((set, _get) => ({
  allStage: [],
  loading: false,
  createNewStage: async (params, onSuccess) => {
    try {
      set((state) => ({ ...state, loading: true }));
      const response = await addDoc(
        collection(firestore, FirestoreSchema.STAGE),
        {
          ...params,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );

      if (response) {
        onSuccess?.();
        toastSuccess({
          title: "Tạo giai đoạn mới thành công",
        });
      }
    } catch (error: any) {
      console.log("🚀 Lỗi tạo mới giai đoạn", error.message);
      toastError({
        title: "Có lỗi xảy ra khi tạo giai đoạn mới, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  getAllStage: async (filter) => {
    set((state) => ({ ...state, loading: true }));
    const stageRef = collection(firestore, FirestoreSchema.STAGE);

    const q = query(stageRef, where("userId", "==", filter?.user?.uid || ""));
    onSnapshot(q, (querySnapshot) => {
      const newStage = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          refID: doc.data()?.refID,
          label: doc.data()?.label,
          colorChema: doc.data()?.colorChema,
          description: doc.data()?.description,
          order: doc.data()?.order,
          createdAt: doc.data()?.createdAt,
          userId: doc.data()?.userId,
          isDefault: doc.data()?.isDefault,
          updatedAt: doc.data()?.updatedAt,
        }))
        .sort((a, b) => a.order - b.order) as unknown as Stage[];

      set((state) => ({
        ...state,
        allStage: [...newStage],
      }));
    });
    set((state) => ({ ...state, loading: false }));
  },
  updateStage: async (params, onSuccess, hiddenToast) => {
    set((state) => ({ ...state, loading: true }));
    const { id, ...updatedField } = params;
    const stageDocRef = doc(firestore, FirestoreSchema.STAGE, id || "");

    try {
      await updateDoc(stageDocRef, {
        ...updatedField,
        updatedAt: Timestamp.now(),
      });
      onSuccess?.();

      if (!hiddenToast) {
        toastSuccess({
          title: "Cập nhật thông tin giai đoạn thành công",
        });
      }
    } catch (error: any) {
      console.log("🚀 Lỗi cập nhật giai đoạn", error.message);
      toastError({
        title: "Có lỗi xảy ra khi cập nhật giai đoạn, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  deleteStage: async (params, onSuccess) => {
    set((state) => ({ ...state, loading: true }));
    const { id } = params;
    const stageDocRef = doc(firestore, FirestoreSchema.STAGE, id || "");

    try {
      await deleteDoc(stageDocRef);
      onSuccess?.();
      toastSuccess({
        title: "Xóa giai đoạn thành công",
      });
    } catch (error: any) {
      console.log("🚀 Lỗi xóa nhật giai đoạn", error.message);
      toastError({
        title: "Có lỗi xảy ra khi xóa giai đoạn, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  setStageStore: (params: Partial<StageStore>, onSuccess?: () => void) => {
    set((state) => ({ ...state, loading: false, ...params }));
    onSuccess?.();
  },
}));

export default useStageStore;
