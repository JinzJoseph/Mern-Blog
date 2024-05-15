import React from 'react';
import { useSelector } from 'react-redux';
import { Button, TextInput } from 'flowbite-react'; // Correct import statement

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='mx-w-lg mx-auto p-3 w-full '>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full ">
          <img src={currentUser.profilePic || currentUser.data.profilePic} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
        </div>
        <TextInput type='text' id="username" placeholder='Username..' defaultValue={currentUser.username || currentUser.data.username} />
        <TextInput type='email' id="email" placeholder='Email..' defaultValue={currentUser.email || currentUser.data.email} />
        <TextInput type='password' id="password" placeholder='*******' />
        <Button type='submit' outline>Update</Button> {/* Corrected Button text */}
      </form>
      <div className='text-red-500 justify-between flex m-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out </span>
      </div> {/* Added missing closing tag */}
    </div>
  );
};

export default DashProfile;
