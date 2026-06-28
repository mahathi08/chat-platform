from sqlalchemy.orm import Session

from app.models.server import Server


def create_server(
    db: Session,
    name: str,
    owner_id: int
):

    server = Server(
        name=name,
        owner_id=owner_id
    )

    db.add(server)

    db.commit()

    db.refresh(server)

    return server


def get_servers(
    db: Session
):

    return db.query(Server).all()


def get_server(
    db: Session,
    server_id: int
):

    return db.query(Server).filter(
        Server.id == server_id
    ).first()


def delete_server(
    db: Session,
    server_id: int
):

    server = db.query(Server).filter(
        Server.id == server_id
    ).first()

    if server:

        db.delete(server)

        db.commit()

    return server