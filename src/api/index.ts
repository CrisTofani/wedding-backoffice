import { collection, doc, runTransaction, getDocs } from "firebase/firestore";
import { firestoreDb } from "../firebase";

export type GuestMenu = "standard" | "child" | "vegetarian" | "celiac";
export type ConditionBoolean = "Y" | "N";

export interface Invitation {
  id: string;
  can_add: ConditionBoolean;
  contact: string;
  partecipation: ConditionBoolean;
  partecipants: Guest[];
}

export interface Guest {
  name: string;
  menu: GuestMenu;
  notes: string;
}

const invitationsCollection = collection(firestoreDb, "invitations");

export const getAllInvitations = () => {
  try {
    return getDocs(invitationsCollection)
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Invitation)
        )
      )
      .catch((e) => {
        throw JSON.stringify(e);
      });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getInvitation = (id: string) => {
  const invitationDocRef = doc(invitationsCollection, id);
  try {
    return runTransaction(firestoreDb, async (transaction) => {
      const invitationDoc = await transaction.get(invitationDocRef);
      if (!invitationDoc.exists()) {
        // eslint-disable-next-line no-throw-literal
        throw "Document does not exist!";
      }

      const invitationData = invitationDoc.data();
      console.log("Invitation data: ", invitationData);
      return invitationData;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateInvitation = (id: string, data: Invitation) => {
  const invitationDocRef = doc(invitationsCollection, id);
  try {
    const newInvitation = runTransaction(firestoreDb, async (transaction) => {
      const invitationDoc = await transaction.get(invitationDocRef);
      if (!invitationDoc.exists()) {
        // eslint-disable-next-line no-throw-literal
        throw "Document does not exist!";
      }

      transaction.update(invitationDocRef, { ...data });
      console.log("Invitation updated ", data);
      return data;
    });

    return newInvitation;
  } catch (e) {
    // This will be a "population is too big" error.
    console.error(e);
    return Promise.reject(e);
  }
};
