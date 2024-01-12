import React from "react";
import { Link, useParams } from "react-router-dom";
import { Invitation, getInvitation, updateInvitation } from "../api";
import { Field, FieldArray, Formik, Form } from "formik";

export const InvitationForm = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [invitation, setInvitation] = React.useState<Invitation | undefined>(
    undefined
  );
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    if (!id) return;
    getInvitation(id)
      .then((invitation) => {
        console.log("/*** Invitation ***/", invitation);
        setInvitation(invitation as Invitation);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const handleSubmit = (values: Invitation) => {
    console.log("/*** Form Submitted ***/", values);
    updateInvitation(id as string, values as Invitation)
      .then((_) => {
        alert("Modificato con successo!");
      })
      .catch((_) => {
        alert("Si è verificato un errore, riprova!");
      });
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Formik
      initialValues={
        {
          can_add: invitation ? invitation.can_add : undefined,
          partecipation: invitation ? invitation.partecipation : undefined,
          contact: invitation ? invitation.contact : undefined,
          partecipants: invitation ? invitation.partecipants : [],
        } as Invitation
      }
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <Link to="/">Torna alla home</Link>
          <div id="my-radio-group">Can_add</div>
          <div role="group" aria-labelledby="my-radio-group">
            <label>
              <Field type="radio" name="can_add" value="Y" />Y
            </label>
            <label>
              <Field type="radio" name="can_add" value="N" />N
            </label>
          </div>
          <div id="my-radio-group">Partecipazione</div>
          <div role="group" aria-labelledby="my-radio-group">
            <label>
              <Field type="radio" name="partecipation" value="Y" />Y
            </label>
            <label>
              <Field type="radio" name="partecipation" value="N" />N
            </label>
          </div>
          <label htmlFor="contact">Contatto</label>
          <Field id="contact" name="contact" placeholder="" />
          <FieldArray name="partecipants">
            {({ remove, push }) => (
              <>
                <h3>Partecipanti</h3>
                {values.partecipants.map((_, index) => (
                  <div key={index}>
                    <label htmlFor={`partecipants.${index}.name`}>Nome</label>
                    <Field
                      id={`partecipants.${index}.name`}
                      name={`partecipants.${index}.name`}
                      placeholder=""
                    />
                    <label htmlFor={`partecipants.${index}.menu`}>Menu</label>
                    <Field as="select" name={`partecipants.${index}.menu`}>
                      <option value="standard">standard</option>
                      <option value="child">child</option>
                      <option value="vegetarian">vegetarian</option>
                      <option value="celiac">celiac</option>
                    </Field>
                    <label htmlFor={`partecipants.${index}.notes`}>Note</label>
                    <Field
                      id={`partecipants.${index}.notes`}
                      name={`partecipants.${index}.notes`}
                      placeholder=""
                    />
                    <button type="button" onClick={() => remove(index)}>
                      Rimuovi
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      name: "",
                      menu: "standard",
                      notes: "",
                    })
                  }
                >
                  Aggiungi
                </button>
              </>
            )}
          </FieldArray>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};
