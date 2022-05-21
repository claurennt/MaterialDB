import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import loginAdmin from "../utils/client/loginAdmin";

import { useRouter } from "next/router";

export default function LoginForm({ openPanel, setOpenPanel }) {
  const [loginData, setLoginData] = useState();

  const router = useRouter();

  const handleLoginData = (e) => {
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    const isAuthSuccessfull = await loginAdmin(loginData);

    if (isAuthSuccessfull) {
      setOpenPanel(false);
      router.reload();
    } else {
      alert("Login Failed");
    }
  };

  return (
    <Transition.Root show={openPanel} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpenPanel}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="pointer-events-none fixed right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto relative w-screen max-w-xs">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      className="rounded-md text-red-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={() => setOpenPanel(false)}
                    >
                      <span className="sr-only">Close panel</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex h-60 flex-col overflow-y-scroll bg-white  shadow-xl">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {" "}
                      <div>
                        <h2 className="mt-2 text-center text-3l font-extrabold text-gray-900">
                          Admin Login
                        </h2>
                      </div>
                    </Dialog.Title>
                  </div>
                  <div className="relative flex-1 px-4 sm:px-6">
                    <div className=" flex items-center justify-center sm:px-6 lg:px-8">
                      <div className="max-w-md w-full space-y-8">
                        <form
                          className=" space-y-4"
                          onSubmit={handleLoginRequest}
                        >
                          <input
                            type="hidden"
                            name="remember"
                            defaultValue="true"
                          />
                          <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                              <label htmlFor="username" className="sr-only">
                                Username
                              </label>
                              <input
                                onChange={handleLoginData}
                                id="username"
                                name="username"
                                type="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="username"
                              />
                            </div>
                            <div>
                              <label htmlFor="password" className="sr-only">
                                Password
                              </label>
                              <input
                                onChange={handleLoginData}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="password"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              />
                              <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <span className="absolute left-0  flex items-center pl-3"></span>
                              Sign in
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="absolute px-4 sm:px-6">
                      {/* <div
                        className="h-full border-2 border-dashed border-gray-200"
                        aria-hidden="true"
                      /> */}
                    </div>
                    {/* /End replace */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
