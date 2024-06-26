import { useEffect, useRef } from "react";

// router
import { Link } from "react-router-dom";

// icons
import { FaUserAlt } from "react-icons/fa";

// components
import Modal, { type RefType, type ModalProps } from "./Modal";

import { TopMessage, type TopMessageRefType } from "./TopMessage";

// rtk_Query
import {
  // auth
  useLoginUserMutation,
  useRegisterUserMutation,

  // posts
  useMakePostMutation,

  // types
  type loginData,
} from "../store/api/api";

// react-redux
import useDispatch from "../hooks/useDispatch";
import useSelector from "../hooks/useSelector";
import { setUser } from "../store/features/userSlice";

// types
import type { TInput } from "../types";

// constants
import { postModalInputs } from "../constants";

const loginModalInputs: TInput[] = [
  {
    label: "username",
    type: "text",
    id: "username-input",
    required: true,
    name: "username",
  },
  {
    label: "password",
    type: "password",
    id: "password-input",
    required: true,
    name: "password",
  },
];

const Header = () => {
  // #region refs

  // element refs
  const modalRef = useRef<RefType>(null);
  const messageRef = useRef<TopMessageRefType>(null);
  // non-element refs

  // #endregion refs

  // rtk_query
  // register user
  const [
    registerUser,
    {
      data: registerData,
      error: registerErrorData,
      isSuccess: registerSuccess,
      isError: registerError,
      isLoading: registerLoading,
      status: registerStatus,
    },
  ] = useRegisterUserMutation();

  // login user
  const [
    loginUser,
    {
      isSuccess: loginSuccess,
      isError: loginError,
      isLoading: loginLoading,
      error: loginErrorData,
      data: loginData,
      status: loginStatus,
    },
  ] = useLoginUserMutation();

  const [
    makePost,
    {
      isError: postError,
      isLoading: postLoading,
      isSuccess: postSuccess,
      status: postStatus,
      error: postErrorData,
    },
  ] = useMakePostMutation();

  // #region react-redux

  const dispatch = useDispatch();

  // redux store states
  const { user } = useSelector((state) => state.user);

  // #endregion react-redux

  // #region normal-functions

  const setModalDataAuto = (
    type: "login" | "register" | "addPost",
    setModalData: boolean = true
  ) => {
    const loginModalData: ModalProps = {
      inputs: loginModalInputs,
      submitBtnContent: loginLoading ? "Loading..." : "Login",
      submitFunc: handleLogin,
      title: "Login",
    };

    const registerModalData: ModalProps = {
      inputs: [
        {
          label: "name",
          type: "text",
          id: "name-input",
          required: true,
          name: "name",
        },
        ...loginModalInputs,
        {
          type: "file",
          label: "your image",
          id: "profile-img-input",
          name: "image",
        },
      ],
      submitBtnContent: registerLoading ? "loading..." : "Register",
      submitFunc: handleResister,
      title: "Register",
    };

    const addPostData: ModalProps = {
      inputs: postModalInputs,
      submitBtnContent: postLoading ? "Loading..." : "Add Post",
      submitFunc: handleAddPost,
      title: "Add New Post",
    };

    if (modalRef.current?.submitBtn()) {
      if (type === "login") {
        modalRef.current.submitBtn()!.disabled = loginLoading;
        modalRef.current!.submitBtn()!.textContent =
          loginModalData["submitBtnContent"];
      }

      if (type === "register") {
        modalRef.current.submitBtn()!.disabled = registerLoading;
        modalRef.current!.submitBtn()!.textContent =
          registerModalData["submitBtnContent"];
      }

      if (type === "addPost") {
        modalRef.current.submitBtn()!.disabled = postLoading;
        modalRef.current!.submitBtn()!.textContent =
          addPostData["submitBtnContent"];
      }
    }

    if (setModalData && type) {
      const finalData: Record<typeof type, ModalProps> = {
        login: loginModalData,
        register: registerModalData,
        addPost: addPostData,
      };

      modalRef.current?.setModalData(finalData[type]);
    }
  };

  const stopSendingData = (): boolean => {
    if (modalRef.current?.form())
      return !modalRef.current.useModalForm().emptyRequired.length;

    throw new Error("no modal !");
  };

  // get modal form inputs value to send it to our api
  const getModalData = (dataType: "formData" | "object"): FormData | object => {
    if (modalRef.current) {
      const { requiredInputs, nonEmptyNonReq } =
        modalRef.current.useModalForm();

      const userData: FormData | Record<string, unknown> =
        dataType === "formData" ? new FormData() : {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setPropInUserData = ({ name, val }: { name: string; val: any }) => {
        if (userData instanceof FormData) {
          userData.append(name, val);
        } else {
          userData[name] = val;
        }
      };

      // setting the data in FormData
      [...requiredInputs, ...nonEmptyNonReq].forEach((inp) => {
        if (inp.type === "file") {
          if (inp.multiple) {
            [...inp.files!].forEach((file) =>
              setPropInUserData({ name: inp.name + "[]", val: file })
            );
          } else setPropInUserData({ name: inp.name, val: inp.files![0] });

          return;
        }

        setPropInUserData({ name: inp.name, val: inp.value });
      });

      if (dataType === "formData" && userData instanceof FormData) {
        return userData as FormData;
      } else if (dataType === "object" && !(userData instanceof FormData)) {
        return userData as object;
      } else throw new Error("something went wrong while getting modal data !");
    }

    throw new Error("no modal !");
  };

  // #endregion normal-functions

  // #region handlers

  const handleLogin = () => {
    try {
      const isSend = stopSendingData();

      if (isSend) {
        const userData = getModalData("object") as loginData;

        loginUser(userData);
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : "something went wrong!");
    }
  };

  const handleResister = () => {
    try {
      const isSend = stopSendingData();

      if (isSend) {
        const userData = getModalData("formData") as FormData;

        registerUser(userData);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "something went wrong!";
      messageRef.current?.showMessage({ clr: "red", content: msg, time: 3500 });

      console.log(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null));
  };

  const handleAddPost = () => {
    try {
      const isSend = stopSendingData();

      if (isSend) {
        const postData = getModalData("formData") as FormData;

        makePost(postData);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "something went wrong !";
      console.log(msg);

      messageRef.current?.showMessage({ clr: "red", time: 3500, content: msg });
    }
  };

  // #endregion handlers

  // #region useEffects

  // #region for register
  useEffect(() => {
    if (registerStatus !== "uninitialized") {
      if (registerSuccess) {
        messageRef.current?.showMessage({
          content: "successfully registerd",
          clr: "green",
          time: 3000,
        });

        modalRef.current?.closeModal();
      } else if (registerError) {
        const errorMsg = (
          (registerErrorData as { data: unknown }).data as { message: string }
        )?.message;
        messageRef.current?.showMessage({
          content: errorMsg,
          clr: "red",
          time: 3000,
        });
      }
    }
  }, [registerStatus, registerSuccess, registerError, registerErrorData]);

  useEffect(() => {
    if (registerStatus !== "uninitialized") setModalDataAuto("register", false);
  }, [registerLoading, registerStatus]);

  useEffect(() => {
    if (registerStatus !== "uninitialized") {
      if (registerData?.token)
        localStorage.setItem("token", registerData?.token);
      if (registerData?.user) {
        localStorage.setItem("user", JSON.stringify(registerData.user));
        dispatch(setUser(registerData.user));
      }
    }
  }, [registerStatus, registerData, dispatch]);

  // #endregion for register

  // #region for login
  useEffect(() => {
    if (loginStatus !== "uninitialized") {
      if (loginError) {
        const errorMsg = (
          loginErrorData as Record<string, Record<string, string>>
        ).data.message;

        messageRef.current?.showMessage({
          content: errorMsg,
          clr: "red",
          time: 3000,
        });
      } else if (loginSuccess) {
        messageRef.current?.showMessage({
          content: "login successfully",
          clr: "green",
          time: 3000,
        });

        modalRef.current?.closeModal();
      }
    }
  }, [loginStatus, loginSuccess, loginError, loginErrorData]);

  useEffect(() => {
    if (loginStatus !== "uninitialized") setModalDataAuto("login", false);
  }, [loginLoading, loginStatus]);

  useEffect(() => {
    if (loginStatus !== "uninitialized") {
      if (loginData) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
        localStorage.setItem("token", loginData.token);

        dispatch(setUser(loginData.user));
      }
    }
  }, [loginStatus, loginData, dispatch]);
  // #endregion for login

  // #region for make post

  useEffect(() => {
    // find another way to change text of submit btn
    if (postStatus !== "uninitialized") setModalDataAuto("addPost", false);
  }, [postLoading, postStatus]);

  useEffect(() => {
    if (postStatus !== "uninitialized") {
      if (postSuccess) {
        messageRef.current?.showMessage({
          content: "successfully posted",
          clr: "green",
          time: 3000,
        });

        modalRef.current?.closeModal();
      } else if (postError) {
        const errorMsg = (
          (postErrorData as { data: unknown }).data as { message: string }
        )?.message;

        messageRef.current?.showMessage({
          content: errorMsg,
          clr: "red",
          time: 3000,
        });
      }
    }
  }, [postStatus, postSuccess, postError, postErrorData]);

  // #endregion for make post

  // #endregion useEffects

  return (
    <>
      <header className="bg-white py-4">
        <div className="container d-flex justify-content-between align-items-center gap-2 flex-column flex-sm-row">
          <div className="left-slice d-flex justify-content-center align-items-center gap-2 flex-wrap">
            <Link to="/" className="header-logo text-success">
              <h1 className="text-center h2 m-0">Social Media App</h1>
            </Link>

            {user && (
              <nav className="d-flex gap-1 align-items-center">
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    setModalDataAuto("addPost");
                    modalRef.current?.openModal();
                  }}
                >
                  +
                </button>
                <Link
                  to={"/profile/" + user.id}
                  className="btn btn-outline-success"
                >
                  <FaUserAlt />
                </Link>
              </nav>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
            {!user ? (
              <>
                <button
                  style={{
                    flex: 1,
                  }}
                  className="btn btn-outline-success"
                  id="login-btn"
                  onClick={() => {
                    setModalDataAuto("login");
                    modalRef.current?.openModal();
                  }}
                >
                  Login
                </button>
                <button
                  style={{
                    flex: 1,
                  }}
                  className="btn btn-outline-success"
                  id="register-btn"
                  onClick={() => {
                    setModalDataAuto("register");
                    modalRef.current?.openModal();
                  }}
                >
                  Register
                </button>
              </>
            ) : (
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <TopMessage ref={messageRef} />
      <Modal ref={modalRef} />
    </>
  );
};
export default Header;
