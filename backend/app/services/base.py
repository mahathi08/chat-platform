def delete_channel(
    db: Session,
    channel_id: int,
):

    channel = get_channel(
        db,
        channel_id,
    )

    db.delete(channel)

    db.commit()