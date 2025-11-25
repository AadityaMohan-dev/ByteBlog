

import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface Props {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  
}

function UserEditForm({ user }: Props) {
  

  return (
    <form className="space-y-6 min-w-150 ml-20">
      
      

      
        <>
          <h1 className="text-3xl mb-10">Update Personal Details</h1>

          <div className="flex gap-10">
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input defaultValue={user.firstName} />
            </Field>

            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input defaultValue={user.lastName} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input disabled defaultValue={user.email} />
          </Field>

          <Field>
            <FieldLabel>Avatar</FieldLabel>
            <input type="file" accept="image/*" className="border px-2 py-1 rounded-md" />
          </Field>

          <div className="flex gap-4">
            <Button type="submit">Update</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </>
    
    </form>
  );
}

export default UserEditForm;
