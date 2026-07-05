from typing import Generic, TypeVar, Type

from sqlalchemy.orm import Session

from app.services.base import BaseService


ModelType = TypeVar("ModelType")


class CRUDService(
    BaseService,
    Generic[ModelType],
):

    model: Type[ModelType]

    def __init__(
        self,
        model: Type[ModelType],
    ):
        self.model = model

    def get(
        self,
        db: Session,
        object_id: int,
    ) -> ModelType:

        return self.get_or_404(
            db,
            self.model,
            id=object_id,
        )

    def list(
        self,
        db: Session,
    ):

        return (
            db.query(self.model)
            .all()
        )

    def create(
        self,
        db: Session,
        instance: ModelType,
    ) -> ModelType:

        return self.save(
            db,
            instance,
        )

    def update(
        self,
        db: Session,
        instance: ModelType,
        **kwargs,
    ) -> ModelType:

        for key, value in kwargs.items():

            setattr(
                instance,
                key,
                value,
            )

        return self.save(
            db,
            instance,
        )

    def delete_by_id(
        self,
        db: Session,
        object_id: int,
    ):

        instance = self.get(
            db,
            object_id,
        )

        self.delete(
            db,
            instance,
        )

    def exists(
        self,
        db: Session,
        **filters,
    ) -> bool:

        return super().exists(
            db,
            self.model,
            **filters,
        )

    def count(
        self,
        db: Session,
        **filters,
    ) -> int:

        return super().count(
            db,
            self.model,
            **filters,
        )

    def paginate(
        self,
        db: Session,
        page: int,
        page_size: int,
    ):

        query = db.query(
            self.model,
        )

        return super().paginate(
            query,
            page,
            page_size,
        )