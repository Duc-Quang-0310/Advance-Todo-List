import create from "zustand";
import { Filter, FirestoreSchema, Task } from "./type";
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

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  createNewTask: (params: Task, onSuccess?: () => void) => Promise<void>;
  getAllTask: (filter?: Filter) => Promise<void>;
  updateTask: (
    params: Partial<Task>,
    onSuccess?: () => void,
    hiddenToast?: boolean
  ) => Promise<void>;
  deleteTask: (
    params: Pick<Task, "id">,
    onSuccess?: () => void
  ) => Promise<void>;
  setTaskStore: (params: Partial<TaskStore>) => void;
}

const useTaskStore = create<TaskStore>()((set, _get) => ({
  tasks: [],
  loading: false,
  createNewTask: async (params, onSuccess) => {
    try {
      set((state) => ({ ...state, loading: true }));
      const response = await addDoc(
        collection(firestore, FirestoreSchema.TASK),
        {
          ...params,
          startDate: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );

      if (response) {
        onSuccess?.();
        toastSuccess({
          title: "Tạo công việc mới thành công",
        });
      }
    } catch (error: any) {
      console.log("🚀 Lỗi tạo mới công việc", error.message);
      toastError({
        title: "Có lỗi xảy ra khi tạo công việc mới, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  getAllTask: async (filter) => {
    set((state) => ({ ...state, loading: true }));
    const stageRef = collection(firestore, FirestoreSchema.TASK);

    const q = query(stageRef, where("userId", "==", filter?.user?.uid || ""));
    onSnapshot(q, (querySnapshot) => {
      const newTasks: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()?.name,
        tags: doc.data()?.tags,
        stageId: doc.data()?.stageId,
        startDate: doc.data()?.startDate,
        endDate: doc.data()?.endDate,
        description: doc.data()?.description,
        updatedAt: doc.data()?.updatedAt,
        createdAt: doc.data()?.createdAt,
        index: doc.data()?.index,
      }));

      set((state) => ({
        ...state,
        tasks: [...newTasks],
      }));
    });
    set((state) => ({ ...state, loading: false }));
  },
  updateTask: async (params, onSuccess, hiddenToast) => {
    set((state) => ({ ...state, loading: true }));
    const { id, ...updatedField } = params;
    const taskDocRef = doc(firestore, FirestoreSchema.TASK, id || "");

    try {
      await updateDoc(taskDocRef, {
        ...updatedField,
        updatedAt: Timestamp.now(),
      });
      onSuccess?.();

      if (!hiddenToast) {
        toastSuccess({
          title: "Cập nhật thông tin công việc thành công",
        });
      }
    } catch (error: any) {
      console.log("🚀 Lỗi cập nhật công việc", error.message);
      toastError({
        title: "Có lỗi xảy ra khi cập nhật công việc, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  deleteTask: async (params, onSuccess) => {
    set((state) => ({ ...state, loading: true }));
    const { id } = params;
    const taskDocRef = doc(firestore, FirestoreSchema.TASK, id || "");

    try {
      await deleteDoc(taskDocRef);
      onSuccess?.();
      toastSuccess({
        title: "Xóa công việc thành công",
      });
    } catch (error: any) {
      console.log("🚀 Lỗi xóa nhật công việc", error.message);
      toastError({
        title: "Có lỗi xảy ra khi xóa công việc, xin vui lòng thử lại",
      });
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
  setTaskStore: (params: Partial<TaskStore>, onSuccess?: () => void) => {
    set((state) => ({ ...state, loading: false, ...params }));
    onSuccess?.();
  },
}));

export default useTaskStore;
