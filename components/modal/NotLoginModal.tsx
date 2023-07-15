import useAuthStore from "@/store/authStore";
import { createOrGetUser } from "@/utils";
import { Dialog, Transition } from "@headlessui/react";
import { GoogleLogin } from "@react-oauth/google";
import { Fragment, memo } from "react";

interface Props {
  onClose(): void;
}

export default function NotLoginModal({ onClose }: Props) {
  const { addUser } = useAuthStore();

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden border rounded-2xl dark:text-white bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-black font-bold leading-5 border-b border-b-gray-200  pb-4"
                  >
                    Login to TikTok
                  </Dialog.Title>
                  <div className="mt-6 flex-col items-center flex justify-center">
                    <p className="tracking-wide mb-4 text-sm text-gray-500 ">
                      Continue with google
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={onClose}
                        className=" font-semibold py-2 px-6"
                      >
                        Close
                      </button>
                      <GoogleLogin
                        onSuccess={(response) =>
                          createOrGetUser(response, addUser)
                        }
                        text="signin"
                        size="medium"
                        shape="pill"
                        onError={() => console.log("Login Failed!")}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
